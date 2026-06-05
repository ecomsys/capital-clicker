// src/pages/HomePage.jsx

// таилвинд мерж
import { cn } from "@/lib/utils";
import { useState, useRef, useCallback } from "react";

// компоонеты
import HomeHeader from "@/components/home/Header";
import ClickCounter from "@/components/home/ClickCounter";
import EnergyDisplay from "@/components/home/EnergyDisplay";
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

// импортируем переменные рекламы и приманки пока из файла
import { adBanner } from "@/constants/honeyPot.site.js";

// Массив денежных призов за прохождения кругового прогресса (от 1 до 10 рублей за круг по очереди, потом заново)
const PRIZES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function HomePage() {
  const { flyPrizeFromPoint } = useFlyPrize();
  const { incrementProgress } = useChestStore();

  const [clicks, setClicks] = useState(0); // валюта (общее количество кликов)
  const [energy, setEnergy] = useState(1000); // энергия
  const [progress, setProgress] = useState(0); // прогресс для медведя (0..100)
  const [prizeIndex, setPrizeIndex] = useState(0); // индекс текущего приза

  const counterRef = useRef(null);
  const { flyFromClick } = useFlyingPlus();
  const { flyFromClick: flyCoin } = useFlyingCoin();
  const { dustOnClick } = useDustEffect();

  // Текущий приз (в рублях)
  const currentPrize = PRIZES[prizeIndex];

  // Обработчик получения приза (вызывается из ClickBear при progress >= 100)
  const handleClaimPrize = useCallback(
    (startX, startY) => {
      // Анимация полёта приза к балансу
      flyPrizeFromPoint(startX, startY, ".user-balance");

      // Здесь можно добавить логику начисления баланса
      console.log(`Получен приз: ${currentPrize} руб.`);

      // Переход к следующему призу (зацикливание)
      setPrizeIndex((prev) => (prev + 1) % PRIZES.length);

      // Сброс прогресса
      setProgress(0);
    },
    [currentPrize, flyPrizeFromPoint],
  );

  // Обработчик клика по медведю
  const handleClickBear = useCallback(
    async (event) => {
      if (energy <= 0) return;
      event.stopPropagation();

      if (energy > 0) {
        incrementProgress("main", 10); // +10 к прогрессу сундука
      }

      playSound("/sounds/click.mp3", { volume: 0.35 }).catch(console.warn);

      // Анимации
      flyCoin(event);
      flyFromClick(event, counterRef);
      dustOnClick(event);

      // Увеличиваем валюту (клики) на 1
      setClicks((prev) => prev + 1);
      // Уменьшаем энергию
      setEnergy((prev) => prev - 1);
      // Увеличиваем прогресс (до 100)
      setProgress((prev) => Math.min(prev + 1, 100));
    },
    [energy, flyFromClick, flyCoin, incrementProgress],
  );

  const handleInstall = () =>
    alert("PWA установка – здесь будет логика beforeinstallprompt");

  // Текущий процент для отображения в медведе
  const bearPercent = Math.min(progress, 100);

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col pt-2 sm:pt-4 lg:pt-7.5 pb-1 sm:pb-29 lg:pb-38">
      <AdBanner {...adBanner} className="mb-2 sm:mb-4 lg:mb-5" />

      <HomeHeader />

      <div className="grid grid-cols-3 items-center mt-6 sm:mt-8">
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

      <div
        className={cn(
          "flex justify-center flex-1 items-center",
          "mt-1 mb-4",
          "sm:mt-6 sm:mb-4",
          "lg:mt-2 lg:mb-4",
        )}
      >
        <ClickBear
          onClick={handleClickBear}
          percent={bearPercent}
          prize={`${currentPrize}₽`}
          onClaim={handleClaimPrize}
        />
      </div>

      <div className="flex justify-center mb-8 sm:mb-4 lg:mb-3">
        <EnergyDisplay
          energy={energy}
          iconClasses="w-8 h-8 sm:w-8 sm:h-8"
          textClasses="text-[1.5rem] sm:text-[1.5rem]"
        />
      </div>

      <div className="-translate-y-1/2 sm:translate-y-0 min-w-[18rem] mt-auto pb-4 flex justify-center">
        <HomeActionsGrid />
      </div>
    </div>
  );
}
