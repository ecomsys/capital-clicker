import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/Button";
import useModalStore from "@/stores/useModalStore";
import useChestStore from "@/stores/useChestStore";
import Confetti from "react-confetti";
import { useWheelSound } from "@/hooks/useWheelSound";

// ------------------------------------------------------------
// Цвета секторов
// ------------------------------------------------------------
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

// ------------------------------------------------------------
// Компонент отрисовки секторов
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
    const r = 125;
    const cx = 200 + r * Math.cos(midRad);
    const cy = 200 + r * Math.sin(midRad);
    let label = prizes[i]?.title || "";
    if (label.length > (count <= 6 ? 14 : 10)) {
      label = label.slice(0, count <= 6 ? 12 : 8) + "…";
    }
    const iconUrl = prizes[i]?.icon || "";
    let rot = midAngle + 180;

    slices.push(
      <g key={i} className="transition-opacity hover:opacity-90">
        <path
          d={pathData}
          fill={VIP_COLORS[i % VIP_COLORS.length]}
          stroke="#1a1a2e"
          strokeWidth="3"
          className="cursor-pointer hover:brightness-110"
        />
        <g transform={`translate(${cx}, ${cy}) rotate(${rot})`}>
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
// Хук размера окна
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
// Основной компонент колеса
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
  const resetChest = useChestStore((state) => state.resetChest);
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const wheelRef = useRef(null);
  const { openModal, closeModal } = useModalStore();
  const { playSoundWithFade, stopCurrentSound, resumeAudioContext } =
    useWheelSound();

  const angleStep = 360 / prizes.length;
  const arrowAngle = 270; // Стрелка находится сверху (12 часов), указывает вниз, но в системе углов SVG 270° — это направление вверх (к стрелке). Формула скорректирована.

  // ------------------------------------------------------------
  // Вращение – выбираем случайный приз и крутим к его середине
  // ------------------------------------------------------------
  const spin = useCallback(() => {
    if (spinning || disabled) return;

    closeModal();
    setShowConfetti(false);
    resumeAudioContext();
    stopCurrentSound();
    playSoundWithFade();

    // Случайный индекс приза
    const targetIndex = Math.floor(Math.random() * prizes.length);
    // Середина сектора этого приза (угол в неподвижной системе координат)
    const sectorMid = targetIndex * angleStep + angleStep / 2;
    // Какой угол поворота колеса нужен, чтобы эта середина оказалась под стрелкой?
    // Формула: rotation + delta = targetRotation, где targetRotation = arrowAngle - sectorMid
    let targetRotation = arrowAngle - sectorMid;
    let delta = ((targetRotation % 360) - (rotation % 360) + 360) % 360;
    const fullSpins = 8 + Math.random() * 4;
    const newRotation = rotation + delta + fullSpins * 360;

    setSpinning(true);
    setRotation(newRotation);
  }, [
    spinning,
    disabled,
    rotation,
    prizes,
    angleStep,
    arrowAngle,
    closeModal,
    resumeAudioContext,
    stopCurrentSound,
    playSoundWithFade,
  ]);

  // ------------------------------------------------------------
  // Завершение вращения – вычисляем реальный выигрыш по конечному углу
  // ------------------------------------------------------------
  const finishSpin = useCallback(() => {
    setSpinning(false);
    const finalRotation = rotation % 360;
    // Угол сектора (в мировой системе), который сейчас находится под стрелкой
    let sectorUnderArrow = (arrowAngle - finalRotation + 360) % 360;
    let prizeIndex = Math.floor(sectorUnderArrow / angleStep) % prizes.length;
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
              if (onClose) onClose();
            }}
            className="mt-6 px-6 py-2 bg-golden rounded-full text-black font-bold hover:bg-golden/80 transition"
          >
            Отлично!
          </Button>
        </div>
      ),
      onClose: () => {
        if (onClose) onClose();
      },
    });
    if (onWin) onWin(wonPrize);
  }, [
    rotation,
    angleStep,
    arrowAngle,
    prizes,
    resetChest,
    from,
    openModal,
    closeModal,
    onClose,
    onWin,
  ]);

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

  useEffect(() => {
    if (!spinning) return;
    const wheelEl = wheelRef.current;
    if (!wheelEl) return;
    const onTransitionEnd = (e) => {
      if (e.propertyName === "transform") {
        finishSpin();
      }
    };
    wheelEl.addEventListener("transitionend", onTransitionEnd);
    return () => wheelEl.removeEventListener("transitionend", onTransitionEnd);
  }, [spinning, finishSpin]);

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center w-full",
        className,
      )}
    >
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          numberOfPieces={300}
          recycle={false}
          gravity={0.2}
          colors={["#FFD700", "#FFA500", "#FF4500", "#FFFFFF", "#00FF00"]}
        />
      )}
      <div
        className={cn(
          "relative w-full mx-auto overflow-visible min-w-[9rem] w-[69vw] max-w-[16.75rem] xss:w-[78vw] xss:max-w-[20rem] sm:w-[38vw] sm:w-[40vh] sm:max-w-[60.875rem] lg:w-[50vh] lg:max-w-[80.5rem]",
          "flex-shrink-0 cursor-pointer select-none",
          spinning || disabled
            ? "cursor-not-allowed"
            : "hover:scale-[1.02] active:scale-[0.98]",
          "transition-transform duration-200",
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
        {/* Красная стрелка (визуальная) */}
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <div className="relative">
            <div className="w-0 h-0 border-l-[14px] border-r-[14px] border-t-[28px] border-l-transparent border-r-transparent border-t-[#E53935]" />
            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[20px] border-l-transparent border-r-transparent border-t-[#B71C1C]" />
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1 h-2 bg-white/40 rounded-full blur-[1px]" />
          </div>
        </div>

        <svg
          ref={wheelRef}
          viewBox="0 0 400 400"
          className="w-full h-full drop-shadow-[0_0_25px_rgba(255,215,0,0.4)]"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning ? "transform 8s ease-out" : "none",
          }}
        >
          <defs>
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
          <WheelSectors prizes={prizes} angleStep={angleStep} />
          <circle
            cx="200"
            cy="200"
            r="35"
            fill="url(#grad1)"
            stroke="#1a1a2e"
            strokeWidth="4"
          />
          <circle cx="200" cy="200" r="28" fill="#1a1a2e" opacity="0.3" />
          <image
            href="/images/webp/level-bears/level-super.webp"
            x="150"
            y="150"
            width="100"
            height="100"
            preserveAspectRatio="xMidYMid meet"
          />
        </svg>

        <div className="absolute inset-0 rounded-full pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 bg-[#FFD700] rounded-full opacity-70"
              style={{
                top: `${50 + 47 * Math.sin((i * 30 * Math.PI) / 180)}%`,
                left: `${50 + 47 * Math.cos((i * 30 * Math.PI) / 180)}%`,
                transform: "translate(-50%, -50%)",
                boxShadow: "0 0 6px #FFD700",
              }}
            />
          ))}
        </div>
      </div>

      <Button
        onClick={handleSpin}
        disabled={spinning}
        className={cn(
          "mt-6 px-8 h-[3rem] text-lg font-bold rounded-full transition-all",
          disabled
            ? "bg-gray-500 cursor-not-allowed opacity-50"
            : "bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 hover:scale-105",
          "text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed",
        )}
      >
        {spinning ? "КРУЧУ..." : disabled ? "ЗАБЛОКИРОВАНО" : "КРУТИТЬ"}
      </Button>
    </div>
  );
}

