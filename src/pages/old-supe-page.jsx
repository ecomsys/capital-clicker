// src/pages/SuperGamePage.jsx
import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";

import SuperHeader from "@/components/supergame/Header";
import ClickCounter from "@/components/home/ClickCounter";
import EnergyDisplay from "@/components/home/EnergyDisplay";
import SuperClickBear from "@/components/supergame/SuperClickBear";
import { AdBanner } from "@/components/basic/adBanner";
import GameModeToggle from "@/components/supergame/GameModeToggle";
import { Button } from "@/components/ui/Button";
import SuperPrizeBanner from "@/components/supergame/SuperPrizeBanner";
import SuperGameActionsGrid from "@/components/supergame/SuperGameActionsGrid";
import { playSound } from "@/audio/manager";
import { useFlyingPlus } from "@/hooks/useFlyingPlus";
import { useFlyingCoin } from "@/hooks/useFlyingCoin";
import { useDustEffect } from "@/hooks/useDustEffect";
import { useFlyPrize } from "@/hooks/useFlyPrize";
import { useWindowSize } from "react-use";
import useModalStore from "@/stores/useModalStore";
import useChestStore from "@/stores/useChestStore";
import useSuperBearStore, {
  SUPER_GAME_MODES,
} from "@/stores/useSuperBearStore";
import useSuperPrizeStore from "@/stores/useSuperPrizeStore";
import useBalanceStore from "@/stores/useBalanceStore";
import { adBanner } from "@/constants/honeyPot.site.js";

export default function SuperGamePage() {
  const [toastMessage, setToastMessage] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const [animatedDisplayClicks, setAnimatedDisplayClicks] = useState(null);
  const [isCountUpActive, setIsCountUpActive] = useState(false);
  const countUpTimerRef = useRef(null);

  const [animatingCounter, setAnimatingCounter] = useState(false);

  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);
  const spinTimeoutRef = useRef(null);
  const spinTimeout2Ref = useRef(null);
  const autoCloseTimeoutRef = useRef(null);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [localSpinSpeed, setLocalSpinSpeed] = useState(0.1);

  const counterRef = useRef(null);
  const { flyFromClick } = useFlyingPlus();
  const { selectedPrize, clearSelectedPrize, hasSelectedPrize } =
    useSuperPrizeStore();
  const {
    clicks,
    batteryClicks,
    energy,
    spinSpeed,
    superGameMode,
    addClick,
    decrementEnergy,
    setSpinSpeed,
    getPrizeProgress,
    resetPrizeProgress,
    sendBatteryClicks,
  } = useSuperBearStore();

  const { width, height } = useWindowSize();
  const { openModal, closeModal } = useModalStore();
  const { flyFromClick: flyCoin } = useFlyingCoin();
  const { dustOnClick } = useDustEffect();
  const { flyPrizeFromPoint } = useFlyPrize();
  const { incrementProgress } = useChestStore();
  const { balance, addBalance } = useBalanceStore();

  // Проверка наличия приза → редирект
  useEffect(() => {
    if (!hasSelectedPrize()) {
      navigate("/prize-selection", { replace: true });
    }
  }, [hasSelectedPrize, navigate]);

  // Синхронизация скорости вращения
  useEffect(() => {
    setSpinSpeed(localSpinSpeed);
  }, [localSpinSpeed, setSpinSpeed]);

  // Очистка таймеров
  useEffect(() => {
    return () => {
      if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
      if (spinTimeout2Ref.current) clearTimeout(spinTimeout2Ref.current);
      if (autoCloseTimeoutRef.current)
        clearTimeout(autoCloseTimeoutRef.current);
    };
  }, []);

  // Звук для перевода кликов (можете использовать существующий или добавить новый)
  const playTransferSound = () => {
    playSound("/sounds/coin-into.mp3", { volume: 0.5 }).catch(console.warn);
  };

  // Показать уведомление (тост)
  const showToast = (message, duration = 2000) => {
    setToastMessage(message);
    setToastVisible(true);
    setIsLeaving(false); // сбрасываем при новом тосте
    // Очищаем предыдущий таймер, если есть
    if (window.toastTimer) clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => {
      setIsLeaving(true); // запускаем анимацию ухода
      setTimeout(() => {
        setToastVisible(false);
        setIsLeaving(false);
      }, 300); // длительность анимации должна совпадать с CSS
    }, duration);
  };

  // Функция плавного увеличения числа
  const animateCountUp = (from, to, duration = 500) => {
    if (countUpTimerRef.current) cancelAnimationFrame(countUpTimerRef.current);
    const startTime = performance.now();
    const step = (now) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      const current = from + (to - from) * t;
      setAnimatedDisplayClicks(Math.floor(current));
      if (t < 1) {
        countUpTimerRef.current = requestAnimationFrame(step);
      } else {
        setAnimatedDisplayClicks(null);
        setIsCountUpActive(false);
        countUpTimerRef.current = null;
      }
    };
    setIsCountUpActive(true);
    countUpTimerRef.current = requestAnimationFrame(step);
  };

  // Обработчик отправки батарейных кликов
  const handleSendClicks = async () => {
    const oldClicks = clicks; // запоминаем текущее значение кликов (онлайн-счёт)
    const result = sendBatteryClicks(); // { transferred, prizeAchieved }
    if (result.transferred > 0) {
      showToast(`+${result.transferred} кликов отправлено!`);
      // Запускаем анимацию набегания цифр
      animateCountUp(oldClicks, oldClicks + result.transferred, 600);
      setAnimatingCounter(true); // для эффекта вспышки
      playTransferSound();
      setTimeout(() => setAnimatingCounter(false), 300);
    } else {
      showToast("Нет кликов для отправки");
    }
    if (result.prizeAchieved) {
      await handlePrizeAchieved();
    }
  };

  // Отображаемое значение счётчика (зависит от режима)
  const displayedClicks =
    superGameMode === SUPER_GAME_MODES.BATTERY ? batteryClicks : clicks;

  const displayValue =
    isCountUpActive && animatedDisplayClicks !== null
      ? animatedDisplayClicks
      : displayedClicks;

  // Обработчик получения супер-приза
  const handlePrizeAchieved = useCallback(async () => {
    if (!selectedPrize) return;

    // Анимация полёта к балансу
    const balanceElement = document.querySelector(".user-balance");
    if (balanceElement) {
      const startX = window.innerWidth / 2;
      const startY = window.innerHeight / 2;
      await flyPrizeFromPoint(startX, startY, ".user-balance");
    }

    const prizeValue =
      typeof selectedPrize === "object" ? selectedPrize.value : selectedPrize;
    addBalance(prizeValue);
    console.log(`Супер-приз получен: ${prizeValue} руб.`);

    setShowConfetti(false);
    setTimeout(() => setShowConfetti(true), 50);

    // Закрываем модалку, если она уже открыта (на всякий случай)
    closeModal();

    const onModalClose = () => {
      setShowConfetti(false);
      clearSelectedPrize();
      resetPrizeProgress();
      navigate("/prize-selection", { replace: true });
    };

    playSound("/sounds/wheel-win.mp3", { volume: 0.35 }).catch(console.warn);

    openModal({
      classes: "max-w-md",
      title: "🎉 Поздравляем!",
      blockDuration: 2000,
      onClose: onModalClose,
      content: (
        <div className="text-center py-8">
          <div className="flex justify-center mb-4">
            {selectedPrize.icon ? (
              <img
                src={selectedPrize.icon}
                alt={selectedPrize.title}
                className="w-24 h-24 object-contain"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-golden/20 flex items-center justify-center">
                <span className="text-4xl">🏆</span>
              </div>
            )}
          </div>
          <p className="text-2xl font-bold text-golden mb-2">
            {selectedPrize.title || `${prizeValue} ₽`}
          </p>
          <p className="text-gray-400 mb-4">Вы выиграли супер-приз!</p>
        </div>
      ),
    });
  }, [
    selectedPrize,
    flyPrizeFromPoint,
    addBalance,
    openModal,
    closeModal,
    clearSelectedPrize,
    resetPrizeProgress,
    navigate,
  ]);

  // Обработчик клика по медведю
  const handleClickBear = useCallback(
    async (event) => {
      if (energy <= 0) return;
      event?.stopPropagation();

      playSound("/sounds/click.mp3", { volume: 0.35 }).catch(console.warn);

      // Добавляем клик (внутри стора логика для онлайн/батарея и проверка выигрыша)
      const { prizeAchieved } = addClick();

      // Если приз выбран и клик привёл к выигрышу – показываем модалку и выходим
      if (selectedPrize && prizeAchieved) {
        await handlePrizeAchieved();
        return;
      }

      // Расчёт скорости вращения
      const now = Date.now();
      const diff = now - lastClickTime;
      setLastClickTime(now);

      let newSpeed = 0.3;
      if (diff < 170) newSpeed = 2.2;
      else if (diff < 220) newSpeed = 1.5;
      else if (diff < 330) newSpeed = 1.2;
      else if (diff < 500) newSpeed = 0.7;
      else if (diff < 800) newSpeed = 0.3;

      setLocalSpinSpeed(newSpeed);

      if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
      if (spinTimeout2Ref.current) clearTimeout(spinTimeout2Ref.current);

      spinTimeoutRef.current = setTimeout(() => {
        setLocalSpinSpeed(0.7);
        spinTimeout2Ref.current = setTimeout(() => {
          setLocalSpinSpeed(0.3);
        }, 1000);
      }, 1500);

      // Анимации
      flyCoin(event);
      flyFromClick(event, counterRef);
      dustOnClick(event);

      // Уменьшаем энергию (addClick уже увеличил клики и прогресс)
      decrementEnergy();
      incrementProgress("superGame", 15);
    },
    [
      energy,
      selectedPrize,
      lastClickTime,
      addClick,
      handlePrizeAchieved,
      flyCoin,
      flyFromClick,
      dustOnClick,
      decrementEnergy,
      incrementProgress,
    ],
  );

  const prizeProgress = selectedPrize ? getPrizeProgress() : 0;

  if (!hasSelectedPrize()) {
    return (
      <div className="min-h-screen min-h-[100dvh] flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-golden-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white">Перенаправление на выбор приза...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen min-h-[100dvh] flex flex-col pt-2 sm:pt-4 lg:pt-7.5 pb-4 sm:pb-29 lg:pb-38">
      {/* Toast-уведомление в правом верхнем углу */}
      {toastVisible && (
        <div
          className={`fixed top-4 right-4 z-50 bg-golden text-white px-4 py-3 rounded-md shadow-lg ${
            isLeaving ? "animate-slide-out-right" : "animate-slide-in-right"
          }`}
        >
          {toastMessage}
        </div>
      )}

      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <Confetti
            width={width}
            height={height}
            numberOfPieces={300}
            recycle={false}
            gravity={0.2}
            colors={["#FFD700", "#FFA500", "#FF4500", "#FFFFFF", "#00FF00"]}
          />
        </div>
      )}

      <AdBanner {...adBanner} className="mb-2 sm:mb-4 lg:mb-5" />
      <SuperHeader userBalance={balance} />
      <SuperPrizeBanner
        prize={selectedPrize}
        progress={prizeProgress}
        className="max-w-[46.625rem] mx-auto mt-2 sm:mt-4"
      />
      <GameModeToggle className="w-full max-w-[46.625rem] mx-auto mt-1.5 sm:mt-3" />

      <div className="h-10 sm:h-[3.25rem] flex sm:grid sm:grid-cols-3 items-center mt-3 w-full max-w-[46.625rem] mx-auto">
        {/* Левая колонка для десктопа (скрыта на мобилке, чтобы не занимать место) */}
        <div className="hidden sm:block" />

        <div
          ref={counterRef}
          className={`
      ${animatingCounter ? "counter-animate" : ""}
      ${
        superGameMode === SUPER_GAME_MODES.BATTERY
          ? "mr-auto sm:mr-0"
          : "mx-auto sm:mx-0"
      }
      sm:justify-self-center
    `}
        >
          <ClickCounter clicks={displayValue} />
        </div>

        <div className="justify-self-end">
          {superGameMode === SUPER_GAME_MODES.BATTERY && (
            <Button
              onClick={handleSendClicks}
              className="sm:min-w-[8.75rem] rounded-[1rem] px-5 h-10 sm:h-[3.25rem] text-white bg-golden hover:bg-golden/80 active:scale-95"
            >
              <span>Отправить</span>
            </Button>
          )}
        </div>
      </div>

      <div className="flex justify-center flex-1 items-center mb-6 sm:mb-4 lg:mb-0">
        <SuperClickBear onClick={handleClickBear} spinSpeed={spinSpeed} />
      </div>

      <div className="flex justify-center mb-8 sm:mb-4">
        <EnergyDisplay energy={energy} />
      </div>

      <div className="-translate-y-1/2 sm:translate-y-0 min-w-[18rem] mt-auto pb-4 flex sm:justify-center">
        <SuperGameActionsGrid />
      </div>
    </div>
  );
}
