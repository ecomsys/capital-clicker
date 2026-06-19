import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/Button";
import useModalStore from "@/stores/useModalStore";
import useChestStore from "@/stores/useChestStore";
import useWheelPrizesBagStore from "@/stores/useWheelPrizesBagStore";
import Confetti from "react-confetti";
import { useWheelSound } from "@/hooks/useWheelSound";

// ------------------------------------------------------------
// КОНСТАНТЫ
// ------------------------------------------------------------
const FORCED_PRIZE = null;

const VIP_COLORS = [
  "url(#grad1)",
  "url(#grad2)",
  "url(#grad3)",
  "url(#grad4)",
  "url(#grad5)",
  "url(#grad6)",
  "url(#grad7)",
  "url(#grad8)",
];

const SPIN_DURATION = 8000;
const ARROW_ANGLE = 270;

// ------------------------------------------------------------
// КОМПОНЕНТ СТРЕЛКИ (развёрнута на 180°, острая вниз)
// ------------------------------------------------------------
const WheelArrow = () => (
  <g transform="translate(200, 18)" className="pointer-events-none" style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.6))' }}>
    {/* Тень под стрелкой */}
    <polygon
      points="0,32 -16,-12 16,-12"
      fill="rgba(0,0,0,0.5)"
      transform="translate(3, -5)"
    />
    
    {/* Основная стрелка (красная с градиентом) */}
    <polygon
      points="0,32 -16,-12 16,-12"
      fill="url(#arrowGrad)"
      stroke="#B71C1C"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    
    {/* Блик на левой половине */}
    <polygon
      points="0,32 -16,-12 0,-12"
      fill="rgba(255,255,255,0.12)"
    />
    
    {/* Светлая окантовка */}
    <polygon
      points="0,30 -12,-8 12,-8"
      fill="none"
      stroke="rgba(255,255,255,0.15)"
      strokeWidth="1.5"
    />
    
    {/* Кружок крепления (сверху) */}
    <circle cx="0" cy="-12" r="7" fill="#B71C1C" stroke="#7f0000" strokeWidth="1.5" />
    <circle cx="0" cy="-12" r="3.5" fill="#E53935" />
    
    {/* Блик на кружке */}
    <circle cx="-2" cy="-14" r="1.5" fill="rgba(255,255,255,0.3)" />
  </g>
);

// ------------------------------------------------------------
// КОМПОНЕНТ СЕКТОРОВ КОЛЕСА
// ------------------------------------------------------------
const WheelSectors = ({ prizes, angleStep }) => {
  const count = prizes.length;
  const slices = [];

  for (let i = 0; i < count; i++) {
    const startAngle = i * angleStep;
    const endAngle = (i + 1) * angleStep;
    const largeArc = angleStep > 180 ? 1 : 0;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    const x1 = 200 + 180 * Math.cos(startRad);
    const y1 = 200 + 180 * Math.sin(startRad);
    const x2 = 200 + 180 * Math.cos(endRad);
    const y2 = 200 + 180 * Math.sin(endRad);
    const pathData = `M 200 200 L ${x1} ${y1} A 180 180 0 ${largeArc} 1 ${x2} ${y2} Z`;

    const midAngle = startAngle + angleStep / 2;
    const midRad = (midAngle * Math.PI) / 180;
    const cx = 200 + 125 * Math.cos(midRad);
    const cy = 200 + 125 * Math.sin(midRad);

    let label = prizes[i]?.title || "";
    const maxLen = count <= 6 ? 14 : 10;
    if (label.length > maxLen) {
      label = label.slice(0, maxLen - 2) + "…";
    }

    const iconUrl = prizes[i]?.icon || "";

    slices.push(
      <g key={i} className="transition-opacity hover:opacity-90">
        <path
          d={pathData}
          fill={VIP_COLORS[i % VIP_COLORS.length]}
          stroke="#1a1a2e"
          strokeWidth="3"
          className="cursor-pointer hover:brightness-110"
        />
        <g transform={`translate(${cx}, ${cy}) rotate(${midAngle + 180})`}>
          {iconUrl && (
            <image
              href={iconUrl}
              x="-50"
              y="-27.5"
              width="55"
              height="55"
              preserveAspectRatio="xMidYMid meet"
            />
          )}
          <text
            x={iconUrl ? "5" : "0"}
            y="4"
            fill="#fff"
            fontSize={count <= 6 ? "18" : "17"}
            fontWeight="800"
            textAnchor="start"
            dominantBaseline="middle"
            style={{
              textShadow: "0 2px 4px rgba(0,0,0,0.7)",
              letterSpacing: "0.5px",
            }}
            className="pointer-events-none select-none"
          >
            {label}
          </text>
        </g>
      </g>,
    );
  }

  return slices;
};

// ------------------------------------------------------------
// ХУК РАЗМЕРА ОКНА
// ------------------------------------------------------------
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handler = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return size;
}

// ------------------------------------------------------------
// ОСНОВНОЙ КОМПОНЕНТ КОЛЕСА
// ------------------------------------------------------------
export default function Wheel({
  prizes,
  onWin,
  className,
  disabled = false,
  disabledMessage = "Колесо временно недоступно",
  onClose = null,
  from = "main",
}) {
  // --- Сторы и хуки ---
  const resetChest = useChestStore((s) => s.resetChest);
  const { openModal, closeModal } = useModalStore();
  const { playSoundWithFade, stopCurrentSound, resumeAudioContext } =
    useWheelSound();
  const { initializePrizes, getRandomPrize } = useWheelPrizesBagStore();
  const { width, height } = useWindowSize();

  // --- Локальный стейт ---
  const [showConfetti, setShowConfetti] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);

  // --- Инициализация мешка призов из localStorage ---
  useEffect(() => {
    if (prizes?.length > 0) initializePrizes(prizes);
  }, [prizes, initializePrizes]);

  // --- Вычисляемые значения ---
  const angleStep = 360 / prizes.length;

  // ------------------------------------------------------------
  // ЗАВЕРШЕНИЕ ВРАЩЕНИЯ
  // ------------------------------------------------------------
  const finishSpin = useCallback(
    (prizeIndex) => {
      setSpinning(false);
      const wonPrize = prizes[prizeIndex];
      if (!wonPrize) return;

      resetChest(from);
      setShowConfetti(false);
      setTimeout(() => setShowConfetti(true), 50);

      openModal({
        classes: "max-w-md",
        title: "Поздравляем!",
        content: (
          <div className="text-center py-8">
            <div className="flex justify-center mb-4">
              {wonPrize.icon && (
                <img
                  src={wonPrize.icon}
                  alt={wonPrize.title}
                  className="w-24 h-24 object-contain"
                />
              )}
            </div>
            <p className="text-2xl font-bold text-[#FFD700] mb-2">
              {wonPrize.title}
            </p>
            <Button
              onClick={() => {
                closeModal();
                setShowConfetti(false);
                onClose?.();
              }}
              className="mt-6 px-6 py-2 bg-golden rounded-full text-black font-bold hover:bg-golden/80 transition"
            >
              Отлично!
            </Button>
          </div>
        ),
        onClose: () => onClose?.(),
      });

      onWin?.(wonPrize);
    },
    [prizes, resetChest, from, openModal, closeModal, onClose, onWin],
  );

  // ------------------------------------------------------------
  // ВРАЩЕНИЕ
  // ------------------------------------------------------------
  const spin = useCallback(() => {
    if (spinning || disabled) return;

    closeModal();
    setShowConfetti(false);
    resumeAudioContext();
    stopCurrentSound();
    playSoundWithFade();

    let targetIndex;
    let selectedPrize;

    if (FORCED_PRIZE) {
      let forcedIdx = prizes.findIndex((p) => p.title === FORCED_PRIZE);
      if (forcedIdx === -1) {
        const normalized = FORCED_PRIZE.trim().toLowerCase();
        forcedIdx = prizes.findIndex(
          (p) => p.title.trim().toLowerCase() === normalized,
        );
      }

      if (forcedIdx !== -1) {
        targetIndex = forcedIdx;
        selectedPrize = prizes[forcedIdx];
      } else {
        console.warn(
          `[FORCED] Приз "${FORCED_PRIZE}" не найден, берём из мешка`,
        );
        selectedPrize = getRandomPrize();
        targetIndex = prizes.findIndex((p) => p.title === selectedPrize?.title);
      }
    } else {
      selectedPrize = getRandomPrize();
      targetIndex = prizes.findIndex((p) => p.title === selectedPrize?.title);
    }

    if (targetIndex === -1 || !selectedPrize) {
      console.error("[SPIN] Приз не найден в массиве prizes");
      return;
    }

    const sectorMid = targetIndex * angleStep + angleStep / 2;
    const targetAngle = (((ARROW_ANGLE - sectorMid) % 360) + 360) % 360;
    const currentAngle = rotation % 360;

    let delta = targetAngle - currentAngle;
    if (delta < 0) delta += 360;

    const fullSpins = 8 + Math.floor(Math.random() * 4);
    const newRotation = rotation + delta + fullSpins * 360;

    console.log(
      `[SPIN] приз: "${selectedPrize.title}" | индекс: ${targetIndex} | оборотов: ${fullSpins} | угол: ${newRotation.toFixed(1)}°`,
    );

    setSpinning(true);
    setRotation(newRotation);

    setTimeout(() => finishSpin(targetIndex), SPIN_DURATION + 100);
  }, [
    spinning,
    disabled,
    rotation,
    prizes,
    angleStep,
    closeModal,
    resumeAudioContext,
    stopCurrentSound,
    playSoundWithFade,
    finishSpin,
    getRandomPrize,
  ]);

  // ------------------------------------------------------------
  // ОБРАБОТЧИК КЛИКА
  // ------------------------------------------------------------
  const handleSpin = () => {
    if (disabled) {
      openModal({
        classes: "max-w-sm",
        title: "Колесо заблокировано",
        content: (
          <div className="text-center px-6 pb-6 pt-14">
            <p className="text-lg mb-4">{disabledMessage}</p>
            <Button
              onClick={closeModal}
              className="bg-golden text-black font-bold"
            >
              Понятно
            </Button>
          </div>
        ),
      });
      return;
    }
    spin();
  };

  // ------------------------------------------------------------
  // РЕНДЕР
  // ------------------------------------------------------------
  return (
    <div
      className={cn(
        "relative w-full h-full flex flex-col items-center justify-center",
        className,
      )}
    >
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

      {/* Контейнер колеса */}
      <div
        className={cn(
          "w-full flex-1 min-h-0 flex items-center justify-center relative",
          "cursor-pointer select-none",
          spinning || disabled ? "cursor-not-allowed" : "cursor-pointer",
        )}
        onClick={handleSpin}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={
          spinning
            ? "Рулетка крутится"
            : disabled
              ? "Заблокировано"
              : "Кликните чтобы крутить"
        }
      >
        <svg
          viewBox="0 0 400 440"
          className={cn(
            "w-full h-full max-h-[55vh] drop-shadow-[0_0_1.5rem_rgba(255,215,0,0.4)]",
            "overflow-visible"
          )}
          style={{
            overflow: "visible",
          }}
        >
          <defs>
            {/* Градиент для стрелки */}
            <linearGradient id="arrowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#B71C1C" />
              <stop offset="40%" stopColor="#E53935" />
              <stop offset="100%" stopColor="#FF6B6B" />
            </linearGradient>

            {[...Array(8)].map((_, i) => (
              <linearGradient
                key={i}
                id={`grad${i + 1}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor={`hsl(${i * 45}, 100%, 65%)`} />
                <stop offset="50%" stopColor="#FFD700" />
                <stop
                  offset="100%"
                  stopColor={`hsl(${i * 45 + 30}, 100%, 50%)`}
                />
              </linearGradient>
            ))}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>


          {/* Группа вращающихся элементов */}
          <g
            style={{
              transform: `rotate(${rotation}deg)`,
              transformOrigin: "200px 200px",
              transition: spinning
                ? `transform ${SPIN_DURATION}ms ease-out`
                : "none",
            }}
          >
            {/* Внешнее золотое кольцо */}
            <circle
              cx="200"
              cy="200"
              r="195"
              fill="none"
              stroke="#FFD700"
              strokeWidth="8"
              filter="url(#glow)"
            />
            <circle
              cx="200"
              cy="200"
              r="190"
              fill="none"
              stroke="#1a1a2e"
              strokeWidth="2"
            />

            {/* Сектора с призами */}
            <WheelSectors prizes={prizes} angleStep={angleStep} />

            {/* Центральная кнопка */}
            <circle
              cx="200"
              cy="200"
              r="35"
              fill="url(#grad1)"
              stroke="#1a1a2e"
              strokeWidth="4"
            />

            <image
              href="/images/webp/splash-poster-black.webp"
              x="160"
              y="160"
              width="80"
              height="80"
              preserveAspectRatio="xMidYMid meet"
            />
          </g>
          
          {/* Стрелка (НЕ вращается) */}
          <WheelArrow />
        </svg>
      </div>

      {/* Кнопка вращения */}
      <div className="flex-shrink-0 mt-2 mb-8">
        <Button
          onClick={handleSpin}
          disabled={spinning}
          className={cn(
            "px-8 h-[3rem] text-lg font-bold rounded-full transition-all",
            disabled
              ? "bg-gray-500 cursor-not-allowed opacity-50"
              : "bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 hover:scale-105",
            "text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {spinning ? "КРУЧУ..." : disabled ? "ЗАБЛОКИРОВАНО" : "КРУТИТЬ"}
        </Button>
      </div>
    </div>
  );
}