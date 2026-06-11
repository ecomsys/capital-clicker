// src/pages/HomePage.jsx
import { useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

// компоненты
import Header from "@/components/basic/Header";
import ClickCounter from "@/components/home/ClickCounter";
import EnergyDisplay from "@/components/home/EnergyDisplay";
import InstallAppButton from "@/components/home/InstallAppButton/InstallAppButton";
import ClickBear from "@/components/home/ClickBear/ClickBear";
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
import useHomeBearStore from "@/stores/useHomeBearStore"; // ← новый стор

import { adBanner } from "@/constants/honeyPot.site.js";
import { isMobile } from 'react-device-detect';
import {clsx} from "clsx";

function generateProgressivePrizes(length, start = 1, step = 1) {
  return Array.from({ length }, (_, i) => start + i * step);
}

const PRIZES = generateProgressivePrizes(100);

export default function HomePage() {
  const { flyPrizeFromPoint } = useFlyPrize();
  const { incrementProgress: incrementChestProgress } = useChestStore();
  const { balance, addBalance } = useBalanceStore();

  // Используем home bear store
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

      incrementChestProgress("main", 10);
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
    <div className={clsx(
        !isMobile && ["min-h-screen", "min-h-[100dvh]", "flex", "flex-col", "pt-2", "sm:pt-4", "lg:pt-7.5", "pb-1", "sm:pb-29", "lg:pb-38"],
        isMobile && ["mobile-screen", "flex", "flex-col", "justify-between", "pb-19"])
    }>
      <AdBanner {...adBanner} className={clsx(!isMobile && ["mb-2", "sm:mb-4", "lg:mb-5"], isMobile && ["h-80/1000", "mb-1"], "advert")} />
      <Header userBalance={balance} className={clsx(isMobile && ["home-header", "mb-2"])}/>

      <div className={clsx(!isMobile && ["grid", "grid-cols-3", "items-center", "mt-6", "sm:mt-8"],
          isMobile && ["flex", "h-75/1000", "mb-2"])
      }>
        <div className={clsx(!isMobile && ["justify-self-start"])}>
          <InstallAppButton onInstall={handleInstall} />
        </div>
        <div ref={counterRef} className={clsx(!isMobile && ["justify-self-center"])}>
          <ClickCounter clicks={clicks} />
        </div>
        <div className={clsx(!isMobile && ["justify-self-end", "invisible"])}>
          <div className={clsx(!isMobile && ["w-20", "h-8"])} />
        </div>
      </div>

      <div
        className={clsx(!isMobile && [
          "flex justify-center flex-1 items-center",
          "mt-1 mb-4",
          "sm:mt-6 sm:mb-4",
          "lg:mt-2 lg:mb-4",],
            isMobile && ["flex", "items-center", "justify-center", "h-325/1000"]
        )}
      >
        <ClickBear
          onClick={handleClickBear}
          percent={bearPercent}
          prize={`${currentPrize}₽`}
          onClaim={handleClaimPrize}
        />
      </div>
      <div className={clsx(isMobile && ["-mt-2", "h-295/1000", "flex", "items-end", "justify-center"])}>
          <div className={clsx(!isMobile && ["-translate-y-1/2", "sm:translate-y-0", "min-w-[18rem]", "mt-auto", "pb-4",])}>
              <HomeActionsGrid energy={energy} />
          </div>
      </div>
    </div>
  );
}
