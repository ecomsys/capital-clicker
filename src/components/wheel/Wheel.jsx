import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/Button";
import useModalStore from "@/stores/useModalStore";
import Confetti from "react-confetti";

// градиенты для секторов
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

// Золотая рамка-блик
const GoldBorder = () => (
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
        <stop offset="100%" stopColor={`hsl(${i * 45 + 30}, 100%, 50%)`} />
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
);

export default function Wheel({ prizes, onWin, className }) {
  // Простой хук для получения размеров окна (без лишних зависимостей)
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

  const [showConfetti, setShowConfetti] = useState(false); //
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const wheelRef = useRef(null);
  const { openModal, closeModal } = useModalStore();
  const { width, height } = useWindowSize();

  const count = prizes.length;
  const angleStep = 360 / count;

  const renderSectors = () => {
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

      const r = 130; // радиус размещения группы (иконка+текст)
      const cx = 200 + r * Math.cos(midRad);
      const cy = 200 + r * Math.sin(midRad);

      let label = prizes[i]?.title || "";
      if (label.length > (count <= 6 ? 14 : 10)) {
        label = label.slice(0, count <= 6 ? 12 : 8) + "…";
      }
      const iconUrl = prizes[i]?.icon || "";

      // Поворот: текст идёт от центра наружу, но в нижней половине переворачиваем на 180°
      let rot = midAngle + 180;
      // if (midAngle > 90 && midAngle < 270) rot += 180;

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
                x="-40"
                y="-20"
                width="40"
                height="40"
                preserveAspectRatio="xMidYMid meet"
              />
            )}
            <text
              x={iconUrl ? "15" : "0"}
              y="4"
              fill="#fff"
              fontSize={count <= 6 ? "18" : "15"}
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

  const finishSpin = useCallback(
    (finalRotation) => {
      setSpinning(false);
      const arrowWorldAngle = 270;
      let localAngle = (arrowWorldAngle - finalRotation) % 360;
      if (localAngle < 0) localAngle += 360;
      const prizeIndex = Math.floor(localAngle / angleStep) % count;
      const wonPrize = prizes[prizeIndex];

     
    // 1. Выключаем конфетти
    setShowConfetti(false);
    // 2. Через мизерное время включаем – React пересоздаст Confetti и анимация начнётся заново
    setTimeout(() => setShowConfetti(true), 50);



      // Открываем модалку с результатом
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
              onClick={()=>{
                closeModal();
                setShowConfetti(false);
              }}
              className="mt-6 px-6 py-2 bg-golden rounded-full text-black font-bold hover:bg-golden/80 transition"
            >
              Отлично!
            </Button>
          </div>
        ),
      });

      if (onWin) onWin(wonPrize);
    },
    [count, prizes, onWin, angleStep, openModal, closeModal],
    
  );

  const spin = useCallback(() => {
    if (spinning) return;
    closeModal(); // закрываем модалку, если была открыта
    setShowConfetti(false);
    setSpinning(true);
    const spins = 5 + Math.random() * 5;
    const extraAngle = Math.random() * 360;
    const newRotation = rotation + spins * 360 + extraAngle;
    setRotation(newRotation);
  }, [spinning, rotation, closeModal]);

  const handleWheelClick = useCallback(
    (e) => {
      if (spinning) return;
      e.stopPropagation();
      spin();
    },
    [spinning, spin],
  );

  useEffect(() => {
    if (!spinning) return;
    const wheelEl = wheelRef.current;
    if (!wheelEl) return;
    const handleTransitionEnd = (e) => {
      if (e.propertyName === "transform") {
        finishSpin(rotation);
      }
    };
    wheelEl.addEventListener("transitionend", handleTransitionEnd);
    return () =>
      wheelEl.removeEventListener("transitionend", handleTransitionEnd);
  }, [spinning, rotation, finishSpin]);

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
          className="z-100"
          recycle={false}
          gravity={0.2}
          colors={["#FFD700", "#FFA500", "#FF4500", "#FFFFFF", "#00FF00"]}
        />
      )}

      <div
        className={cn(
          "relative w-full mx-auto overflow-visible min-w-[9rem] w-[69vw] max-w-[16.75rem] xss:w-[78vw] xss:max-w-[20rem] sm:w-[38vw] sm:max-w-[25rem] sm:min-w-[14.875rem] lg:w-[40vh] lg:max-w-[80.5rem]",
          "flex-shrink-0 cursor-pointer select-none",
          spinning ? "cursor-wait" : "hover:scale-[1.02] active:scale-[0.98]",
          "transition-transform duration-200",
        )}
        onClick={handleWheelClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handleWheelClick(e)}
        aria-label={spinning ? "Рулетка крутится" : "Кликните чтобы крутить"}
      >
        {/* Стрелка */}
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <div className="relative">
            <div className="w-0 h-0 border-l-[14px] border-r-[14px] border-t-[28px] border-l-transparent border-r-transparent border-t-[#FFD700]" />
            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[20px] border-l-transparent border-r-transparent border-t-[#B8860B]" />
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1 h-2 bg-white/40 rounded-full blur-[1px]" />
          </div>
        </div>

        {/* SVG Колесо */}
        <svg
          ref={wheelRef}
          viewBox="0 0 400 400"
          className="w-full h-full drop-shadow-[0_0_25px_rgba(255,215,0,0.4)]"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning
              ? "transform 3.5s cubic-bezier(0.17, 0.67, 0.12, 0.99)"
              : "none",
          }}
        >
          <GoldBorder />
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
          {renderSectors()}
          {/* Центр */}
          <circle
            cx="200"
            cy="200"
            r="35"
            fill="url(#grad1)"
            stroke="#1a1a2e"
            strokeWidth="4"
            className="cursor-pointer"
          />
          <circle cx="200" cy="200" r="28" fill="#1a1a2e" opacity="0.3" />
          <text
            x="200"
            y="205"
            textAnchor="middle"
            fill="#FFD700"
            fontSize="11"
            fontWeight="bold"
            className="pointer-events-none"
          >
            SPIN
          </text>
        </svg>

        {/* Блики */}
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
    </div>
  );
}
