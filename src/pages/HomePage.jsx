// src/pages/HomePage.jsx
import { useRef, useCallback } from "react";

// компоненты
import Header from "@/components/basic/Header";
import ClickCounter from "@/components/home/ClickCounter";
import EnergyDisplay from "@/components/basic/EnergyDisplay";
import InstallAppButton from "@/components/home/InstallAppButton";
import ClickBear from "@/components/home/ClickBear";
import HomeActionsGrid from "@/components/home/HomeActionsGrid";
import { AdBanner } from "@/components/basic/adBanner";

// менеджер звуков
import { playSound } from "@/audio/manager";

// хуки
import { useFlyingPlus } from "@/hooks/useFlyingPlus";
import { useFlyingCoin } from "@/hooks/useFlyingCoin";
import { useFlyPrize } from "@/hooks/useFlyPrize";
import { useDustEffect } from "@/hooks/useDustEffect";

// сторы
import useChestStore from "@/stores/useChestStore";
import useBalanceStore from "@/stores/useBalanceStore";
import useHomeBearStore from "@/stores/useHomeBearStore";

import { adBanner } from "@/constants/honeyPot.site.js";

function generateProgressivePrizes(length, start = 1, step = 1) {
  return Array.from({ length }, (_, i) => start + i * step);
}

const PRIZES = generateProgressivePrizes(100);

export default function HomePage() {
  const { flyPrizeFromPoint } = useFlyPrize();
  const { incrementProgress: incrementChestProgress } = useChestStore();
  const { balance, addBalance } = useBalanceStore();

  const {
    progress,
    prizeIndex,
    clicks,
    energy,
    incrementProgress,
    resetProgress,
    incrementPrizeIndex,
    addClick,
    decrementEnergy,
  } = useHomeBearStore();

  const counterRef = useRef(null);
  const { flyFromClick } = useFlyingPlus();
  const { flyFromClick: flyCoin } = useFlyingCoin();
  const { dustOnClick } = useDustEffect();

  const currentPrize = PRIZES[prizeIndex % PRIZES.length];

  const handleClaimPrize = useCallback(
    async (startX, startY) => {
      await flyPrizeFromPoint(startX, startY, ".user-balance");
      console.log(`Получен приз: ${currentPrize} руб.`);
      addBalance(currentPrize);
      incrementPrizeIndex();
      resetProgress();
    },
    [
      currentPrize,
      flyPrizeFromPoint,
      addBalance,
      incrementPrizeIndex,
      resetProgress,
    ],
  );

  const handleClickBear = useCallback(
    (event) => {
      if (energy <= 0) return;
      event.stopPropagation();

      incrementChestProgress("main", 100);
      playSound("/sounds/click.mp3", { volume: 0.35 }).catch(console.warn);

      flyCoin(event);
      flyFromClick(event, counterRef);
      dustOnClick(event);

      addClick();
      decrementEnergy();
      incrementProgress(1);
    },
    [
      energy,
      flyFromClick,
      flyCoin,
      dustOnClick,
      incrementChestProgress,
      addClick,
      decrementEnergy,
      incrementProgress,
    ],
  );

  const handleInstall = () => alert("PWA установка");

  const bearPercent = Math.min(progress, 100);

  return (
    <div className="h-screen h-[100dvh] eco-container flex flex-col pt-2 sm:pt-4 lg:pt-7.5 overflow-hidden">
      <AdBanner
        {...adBanner}
        className="flex-shrink-0 mb-2 sm:mb-4 lg:mb-5"
      />
      <Header userBalance={balance} className="flex-shrink-0" />

      <div className="flex-shrink-0 grid grid-cols-3 items-center mt-4 sm:mt-8 -mb-2">
        <div className="justify-self-start">
          <InstallAppButton onInstall={handleInstall} />
        </div>
        <div ref={counterRef} className="justify-self-center">
          <ClickCounter clicks={clicks} />
        </div>
        <div className="justify-self-end invisible">
          <div className="w-20 h-8" />
        </div>
      </div>

      {/* Медведь занимает всё оставшееся место, но сжимается */}
      <div className="flex-1 min-h-[4rem] flex items-center justify-center px-4 pb-1 sm:pb-0">
        <div className="w-full h-full max-h-[50vh] lg:max-h-[25rem] aspect-square flex items-center justify-center">
          <ClickBear
            onClick={handleClickBear}
            percent={bearPercent}
            prize={`${currentPrize}₽`}
            onClaim={handleClaimPrize}
            className="w-full h-full"
          />
        </div>
      </div>

      <div className="flex-shrink-0 flex justify-center mb-6 sm:mb-4 lg:mb-3">
        <EnergyDisplay
          energy={energy}
          iconClasses="w-8 h-8 sm:w-8 sm:h-8"
          textClasses="text-[1.5rem] sm:text-[1.5rem]"
        />
      </div>

      <div className="flex-shrink-0 min-w-[18rem] pb-4 flex justify-center -mt-[6rem] sm:mt-0">
        <HomeActionsGrid />
      </div>

      {/* нижний буфер   */}
      <div className="flex-shrink-0 h-21 sm:h-25 lg:h-35"></div>
    </div>
  );
}
