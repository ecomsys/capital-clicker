// src/pages/SuperGamePage.jsx

// компонеты
import { useState, useRef, useCallback, useEffect } from "react";
import SuperHeader from "@/components/supergame/Header";
import ClickCounter from "@/components/home/ClickCounter";
import EnergyDisplay from "@/components/home/EnergyDisplay";
import SuperClickBear from "@/components/supergame/SuperClickBear";
import { AdBanner } from "@/components/basic/adBanner";
import GameModeToggle from "@/components/supergame/GameModeToggle";
import { Button } from "@/components/ui/Button";
import SuperPrizeBanner from "@/components/supergame/SuperPrizeBanner";
import SuperGameActionsGrid from "@/components/supergame/SuperGameActionsGrid";

// менеджер звуков
import { playSound } from "@/audio/manager";

// хуки
import { useFlyingPlus } from "@/hooks/useFlyingPlus";
import { useFlyingCoin } from "@/hooks/useFlyingCoin";
import { useDustEffect } from "@/hooks/useDustEffect";

// сторы
import useChestStore from "@/stores/useChestStore";
import useSettingsStore, { SUPER_GAME_MODES } from "@/stores/useSettingsStore";
import usePrizeStore from "@/stores/usePrizeStore";

// импортируем переменные рекламы и приманки пока из файла
import { adBanner } from "@/constants/honeyPot.site.js";

export default function SuperGamePage() {

  // Рефы для таймеров затухания скорости – вместо window
  const spinTimeoutRef = useRef(null);
  const spinTimeout2Ref = useRef(null);

  const [clicks, setClicks] = useState(0);
  const [energy, setEnergy] = useState(1000);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [spinSpeed, setSpinSpeed] = useState(0.1); // медленно по умолчанию

  const counterRef = useRef(null);
  const { flyFromClick } = useFlyingPlus();
  const { superGameMode } = useSettingsStore();
  const { selectedPrize } = usePrizeStore();
  const { flyFromClick: flyCoin } = useFlyingCoin();
  const { dustOnClick } = useDustEffect();

  const { incrementProgress } = useChestStore();

  // Очистка таймеров при размонтировании
  useEffect(() => {
    return () => {
      if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
      if (spinTimeout2Ref.current) clearTimeout(spinTimeout2Ref.current);
    };
  }, []);

  const handleClickBear = useCallback(
    async (event) => {
      if (energy <= 0) return;
      event?.stopPropagation();

      playSound("/sounds/click.mp3", { volume: 0.35 }).catch(console.warn);

      const now = Date.now();
      const diff = now - lastClickTime;
      setLastClickTime(now);

      // Расчёт скорости вращения в зависимости от частоты кликов
      let newSpeed = 0.3;
      if (diff < 170) newSpeed = 2.2;
      else if (diff < 220) newSpeed = 1.5;
      else if (diff < 330) newSpeed = 1.2;
      else if (diff < 500) newSpeed = 0.7;
      else if (diff < 800) newSpeed = 0.3;

      setSpinSpeed(newSpeed);

      // Плавное затухание скорости – сбрасываем старые таймеры
      if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
      if (spinTimeout2Ref.current) clearTimeout(spinTimeout2Ref.current);

      spinTimeoutRef.current = setTimeout(() => {
        setSpinSpeed(0.7);
        spinTimeout2Ref.current = setTimeout(() => {
          setSpinSpeed(0.3);
        }, 1000);
      }, 1500);

      // Анимации
      flyCoin(event);
      flyFromClick(event, counterRef);
      dustOnClick(event);

      setClicks((prev) => prev + 1);
      setEnergy((prev) => prev - 1);

      incrementProgress("superGame", 15);
    },
    [energy, lastClickTime, flyFromClick, flyCoin, incrementProgress],
  );

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col pt-2 sm:pt-4 lg:pt-7.5 pb-4 sm:pb-29 lg:pb-38">
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

      {/* Медведь */}
      <div className="flex justify-center flex-1 items-center mb-6 sm:mb-4 lg:mb-0">
        <SuperClickBear onClick={handleClickBear} spinSpeed={spinSpeed} />
      </div>

      {/* Энергия */}
      <div className="flex justify-center mb-8 sm:mb-4">
        <EnergyDisplay energy={energy} />
      </div>

      <div className="-translate-y-1/2 sm:translate-y-0 min-w-[18rem] mt-auto pb-4 flex sm:justify-center">
        <SuperGameActionsGrid />
      </div>
    </div>
  );
}
