// src/pages/SuperGamePage.jsx
import { useState, useRef, useCallback } from "react";
import SuperHeader from "@/components/supergame/Header";
import ClickCounter from "@/components/home/ClickCounter";
import EnergyDisplay from "@/components/home/EnergyDisplay";
import SuperClickBear from "@/components/supergame/SuperClickBear";
import { AdBanner } from "@/components/basic/adBanner";
import GameModeToggle from "@/components/supergame/GameModeToggle";
import { Button } from "@/components/ui/Button";
import SuperPrizeBanner from "@/components/supergame/SuperPrizeBanner";
import useSettingsStore, { SUPER_GAME_MODES } from "@/stores/useSettingsStore";
import usePrizeStore from "@/stores/usePrizeStore";

import { useFlyingPlus } from "@/hooks/useFlyingPlus";
import { useFlyingCoin } from "@/hooks/useFlyingCoin";

import { playSound, unlockAudio } from "@/audio/manager";

import useChestStore from "@/stores/useChestStore";

export default function SuperGamePage({
  adBanner = {
    href: "https://example.com",
    imageSrc: null,
    title: "РЕКЛАМА",
  },
}) {
  const audioUnlockedRef = useRef(false);

  const [clicks, setClicks] = useState(0);
  const [energy, setEnergy] = useState(1000);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [spinSpeed, setSpinSpeed] = useState(0.1); // медленно по умолчанию (3 сек на оборот)

  const counterRef = useRef(null);
  const { flyFromClick } = useFlyingPlus();
  const { superGameMode } = useSettingsStore();
  const { selectedPrize } = usePrizeStore();
  const { flyFromClick: flyCoin } = useFlyingCoin();
  const { incrementProgress } = useChestStore();

  const handleClickBear = useCallback(
    async (event) => {
      if (energy <= 0) return;
      event?.stopPropagation();

      // Разблокируем аудио при первом клике
      if (!audioUnlockedRef.current) {
        await unlockAudio("/sounds/click.mp3");
        audioUnlockedRef.current = true;
      }
      // Проигрываем звук клика (тихо)
      await playSound("/sounds/click.mp3", { volume: 0.25 }).catch((e) =>
        console.warn(e),
      );

      const now = Date.now();
      const diff = now - lastClickTime;
      setLastClickTime(now);

      let newSpeed = 0.3;
      if (diff < 170) newSpeed = 2.2;
      else if (diff < 220) newSpeed = 1.5;
      else if (diff < 330) newSpeed = 1.2;
      else if (diff < 500) newSpeed = 0.7;
      else if (diff < 800) newSpeed = 0.3;

      setSpinSpeed(newSpeed);

      // Плавное затухание скорости
      if (window.spinTimeout) clearTimeout(window.spinTimeout);
      if (window.spinTimeout2) clearTimeout(window.spinTimeout2);
      window.spinTimeout = setTimeout(() => {
        setSpinSpeed(0.7);
        window.spinTimeout2 = setTimeout(() => {
          setSpinSpeed(0.3);
        }, 1000);
      }, 1500);

      // Анимации
      flyCoin(event);
      flyFromClick(event, counterRef);

      setClicks((prev) => prev + 1);
      setEnergy((prev) => prev - 1);

      incrementProgress('superGame', 15);
    },
    [energy, lastClickTime, flyFromClick, flyCoin,incrementProgress],
  );

  return (
    <div className="min-h-screen flex flex-col pt-2 sm:pt-4 lg:pt-7.5 pb-55 sm:pb-63 lg:pb-76">
      <AdBanner
        href={adBanner.href}
        title={adBanner.title}
        imageSrc={adBanner.imageSrc}
        className="mb-2 sm:mb-4 lg:mb-5"
      />

      <SuperHeader />

      <SuperPrizeBanner
        prize={selectedPrize}
        className="max-w-[46.625rem] mx-auto mt-2 sm:mt-4"
      />
      <GameModeToggle className="w-full max-w-[46.625rem] mx-auto mt-1.5 sm:mt-3" />

      {/* Первый ряд */}
      <div
        className={`h-10 sm:h-[3.25rem] ${superGameMode === SUPER_GAME_MODES.BATTERY ? "flex justify-between" : "grid grid-cols-3 items-center"} mt-3 w-full max-w-[46.625rem] mx-auto`}
      >
        <div
          className={`${superGameMode === SUPER_GAME_MODES.BATTERY ? "hidden sm:block" : ""} justify-self-start invisible`}
        >
          <div className="min-w-[8.75rem] h-8" />
        </div>
        <div ref={counterRef} className="justify-self-center">
          <ClickCounter clicks={clicks} />
        </div>
        <div className="justify-self-end">
          {superGameMode === SUPER_GAME_MODES.BATTERY && (
            <Button
              onClick={() => alert("Отправляем накопленные клики !")}
              className="sm:min-w-[8.75rem] rounded-[1rem] px-5 h-full text-white bg-golden hover:bg-golden/80 active:scale-95"
            >
              <span>Отправить</span>
            </Button>
          )}
        </div>
      </div>

      {/* Медведь – передаём событие и текущую скорость вращения */}
      <div className="flex justify-center flex-1 items-center mb-2 sm:mb-1 lg:mb-0">
        <SuperClickBear
          onClick={(e) => handleClickBear(e)}
          spinSpeed={spinSpeed}
        />
      </div>

      {/* Энергия */}
      <div className="flex justify-center mb-3 sm:mb-4 lg:mb-2">
        <EnergyDisplay energy={energy} />
      </div>
    </div>
  );
}
