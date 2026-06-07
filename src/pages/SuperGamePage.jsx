// src/pages/SuperGamePage.jsx
import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

import Header from "@/components/basic/Header";
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
import { useToast } from "@/hooks/useToast";
import { useCountUp } from "@/hooks/useCountUp";
import { useSpinSpeed } from "@/hooks/useSpinSpeed";
import useModalStore from "@/stores/useModalStore";
import useChestStore from "@/stores/useChestStore";
import useSuperBearStore, {
  SUPER_GAME_MODES,
} from "@/stores/useSuperBearStore";
import useSuperPrizeStore from "@/stores/useSuperPrizeStore";
import useBalanceStore from "@/stores/useBalanceStore";
import { adBanner } from "@/constants/honeyPot.site.js";

export default function SuperGamePage() {
  const navigate = useNavigate();
  const { width, height } = useWindowSize();
  const { openModal, closeModal } = useModalStore();
  const { flyFromClick } = useFlyingPlus();
  const { flyFromClick: flyCoin } = useFlyingCoin();
  const { dustOnClick } = useDustEffect();
  const { flyPrizeFromPoint } = useFlyPrize();
  const { incrementProgress } = useChestStore();
  const { balance, addBalance } = useBalanceStore();

  const { selectedPrize, clearSelectedPrize, hasSelectedPrize } =
    useSuperPrizeStore();
  const {
    clicks,
    batteryClicks,
    energy,
    spinSpeed: globalSpinSpeed,
    superGameMode,
    addClick,
    decrementEnergy,
    setSpinSpeed: setGlobalSpinSpeed,
    getPrizeProgress,
    resetPrizeProgress,
    sendBatteryClicks,
  } = useSuperBearStore();

  // --- локальные состояния ---
  const [showConfetti, setShowConfetti] = useState(false);
  const [animatingCounter, setAnimatingCounter] = useState(false);
  const [lastClickTime, setLastClickTime] = useState(0);

  const counterRef = useRef(null);

  const { toastMessage, toastVisible, toastLeaving, showToast } = useToast();
  
  const { countUpValue, isCountUpActive, startCountUp } = useCountUp();
  const { setSpinSpeed: setLocalSpinSpeed, applySpinDecay } = useSpinSpeed(
    0.1,
    setGlobalSpinSpeed,
  );

  // --- Проверка выбранного приза ---
  useEffect(() => {
    if (!hasSelectedPrize()) navigate("/prize-selection", { replace: true });
  }, [hasSelectedPrize, navigate]);

  // --- Получение супер-приза ---
  const handlePrizeAchieved = useCallback(async () => {
    if (!selectedPrize) return;

    // Получаем значение приза (если есть)
    const prizeValue = selectedPrize.value ?? 0;

    // Если приз имеет денежную ценность (>0) – показываем анимацию полёта и начисляем баланс
    if (prizeValue > 0) {
      const balanceElement = document.querySelector(".user-balance");
      if (balanceElement) {
        const startX = window.innerWidth / 2;
        const startY = window.innerHeight / 2;
        await flyPrizeFromPoint(startX, startY, ".user-balance");
      }
      addBalance(prizeValue);
      console.log(`Супер-приз получен: ${prizeValue} руб.`);
    } else {
      // Для нематериальных призов (подарки, сертификаты) – только уведомление
      console.log(
        `Получен приз: ${selectedPrize.title || selectedPrize.id}`,
      );
    }

    setShowConfetti(false);
    setTimeout(() => setShowConfetti(true), 50);
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
            {selectedPrize.title || "Супер-приз!"}
          </p>
          <p className="text-gray-400 mb-4">
            {prizeValue > 0
              ? `Вы выиграли ${prizeValue.toLocaleString()} ₽!`
              : "Вы выиграли эксклюзивный подарок!"}
          </p>
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

  // --- Обработка отправки батарейных кликов ---
  const handleSendClicks = async () => {
    const oldClicks = clicks;
    const result = sendBatteryClicks();
    if (result.transferred > 0) {
      showToast(`+${result.transferred} кликов отправлено!`);
      startCountUp(oldClicks, oldClicks + result.transferred, 600);
      setAnimatingCounter(true);
      playSound("/sounds/coin-into.mp3", { volume: 0.5 }).catch(console.warn);
      setTimeout(() => setAnimatingCounter(false), 300);
    } else {
      showToast("Нет кликов для отправки");
    }
    if (result.prizeAchieved) await handlePrizeAchieved();
  };

  // --- Обработка клика по медведю ---
  const handleClickBear = useCallback(
    async (event) => {
      if (energy <= 0) return;
      event?.stopPropagation();
      playSound("/sounds/click.mp3", { volume: 0.35 }).catch(console.warn);

      const { prizeAchieved } = addClick();
      if (selectedPrize && prizeAchieved) {
        await handlePrizeAchieved();
        return;
      }

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
      applySpinDecay();

      flyCoin(event);
      flyFromClick(event, counterRef);
      dustOnClick(event);

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
      setLocalSpinSpeed,
      applySpinDecay,
    ],
  );

  // --- Отображаемое значение счётчика ---
  const rawDisplay =
    superGameMode === SUPER_GAME_MODES.BATTERY ? batteryClicks : clicks;
  const displayValue =
    isCountUpActive && countUpValue !== null ? countUpValue : rawDisplay;
  const prizeProgress = selectedPrize ? getPrizeProgress() : 0;

  if (!hasSelectedPrize()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-golden-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white">Перенаправление на выбор приза...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen min-h-[100dvh] flex flex-col pt-2 sm:pt-4 lg:pt-7.5 pb-4 sm:pb-29 lg:pb-38">
      {toastVisible && (
        <div
          className={`fixed top-4 right-4 z-50 bg-golden text-white px-4 py-3 rounded-md shadow-lg ${toastLeaving ? "animate-slide-out-right" : "animate-slide-in-right"}`}
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
      <Header userBalance={balance} />
      <SuperPrizeBanner
        prize={selectedPrize}
        progress={prizeProgress}
        className="max-w-[46.625rem] mx-auto mt-2 sm:mt-4"
      />
      <GameModeToggle className="w-full max-w-[46.625rem] mx-auto mt-1.5 sm:mt-3" />

      <div className="h-10 sm:h-[3.25rem] flex sm:grid sm:grid-cols-3 items-center mt-3 w-full max-w-[46.625rem] mx-auto">
        <div className="hidden sm:block" />
        <div
          className={`${animatingCounter ? "counter-animate" : ""} ${superGameMode === SUPER_GAME_MODES.BATTERY ? "mr-auto sm:mr-0" : "mx-auto sm:mx-0"} sm:justify-self-center`}
          ref={counterRef}
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
        <SuperClickBear onClick={handleClickBear} spinSpeed={globalSpinSpeed} />
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
