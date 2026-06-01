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
import { useFlyingPlus } from "@/hooks/useFlyingPlus"; // импорт хука

export default function SuperGamePage({
  adBanner = {
    href: "https://example.com",
    imageSrc: null,
    title: "РЕКЛАМА",
  },
}) {
  const [clicks, setClicks] = useState(0);
  const [energy, setEnergy] = useState(1000);
  const counterRef = useRef(null);
  const { flyFromClick } = useFlyingPlus();

  const { superGameMode } = useSettingsStore();
  const { selectedPrize } = usePrizeStore();

  const handleClickBear = useCallback(
    (event) => {
      if (energy <= 0) return;
      event?.stopPropagation(); // защита от всплытия, если событие есть
      flyFromClick(event, counterRef);
      setClicks((prev) => prev + 1);
      setEnergy((prev) => prev - 1);
    },
    [energy, flyFromClick],
  );

  return (
    <div className="min-h-screen flex flex-col pt-2 sm:pt-4 lg:pt-7.5 pb-55 sm:pb-60 lg:pb-69">
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
      <div className={`h-10 sm:h-[3.25rem] ${superGameMode === SUPER_GAME_MODES.BATTERY ? "flex justify-between" : "grid grid-cols-3 items-center"} mt-3 w-full max-w-[46.625rem] mx-auto`}>
        <div className={`${superGameMode === SUPER_GAME_MODES.BATTERY ? "hidden sm:block" : ""} justify-self-start invisible`}>
          <div className="min-w-[8.75rem] h-8" />
        </div>
        {/* Оборачиваем ClickCounter в div с ref */}
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

      {/* Медведь – передаём событие в обработчик */}
      <div className="flex justify-center flex-1 items-center">
        <SuperClickBear onClick={(e) => handleClickBear(e)} />
      </div>

      {/* Энергия */}
      <div className="flex justify-center mt-1 mb-3">
        <EnergyDisplay energy={energy} />
      </div>
    </div>
  );
}
