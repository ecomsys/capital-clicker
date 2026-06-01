// src/components/shop/ClickSlider.jsx

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { FectiveButton } from "@/components/ui/FectiveButton";

export function ClickSliderContent({
  className,
  onBuy,
  title = "Количество кликов",
  description = "Кол-во кликов в секунду позволит вам увеличить шанс получения выбранного вознаграждения",
  steps = [
    { info: "2 кл/сек", price: "50" },
    { info: "3 кл/сек", price: "100" },
    { info: "4 кл/сек", price: "150" },
    { info: "5 кл/сек", price: "550" },
    { info: "10 кл/сек", price: "1000" },
    { info: "15 кл/сек", price: "1500" },
    { info: "20 кл/сек", price: "50000" },
  ],
  defaultIndex = 3,
  buttonText = "Купить",
}) {
  const [stepIndex, setStepIndex] = useState(defaultIndex);
  const [isDragging, setIsDragging] = useState(false);
  const currentInfo = steps[stepIndex].info;
  const currentPrice = steps[stepIndex].price;

  const sliderRef = useRef(null);
  const thumbRef = useRef(null);

  const handleBuy = () => {
    if (onBuy) {
      onBuy(currentPrice, stepIndex);
    }
  };

  // Обновление позиции на основе координаты
  const updatePositionFromX = (clientX) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(1, x / rect.width));
    const newIndex = Math.round(percent * (steps.length - 1));
    const clampedIndex = Math.max(0, Math.min(steps.length - 1, newIndex));
    setStepIndex(clampedIndex);
  };

  // Обработчик клика по слайдеру
  const handleSliderClick = (e) => {
    if (isDragging) return;
    updatePositionFromX(e.clientX);
  };

  // Обработчик клика по кружку
  const handleStepClick = (idx, e) => {
    e.stopPropagation();
    setStepIndex(idx);
  };

  // Drag & Drop handlers
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    updatePositionFromX(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    updatePositionFromX(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch events для мобильных устройств
  const handleTouchStart = (e) => {
    // e.preventDefault();
    setIsDragging(true);
    updatePositionFromX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    updatePositionFromX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleTouchEnd);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [isDragging]);

  // Вычисляем процент с ограничением для бегунка
  const percent = (stepIndex / (steps.length - 1)) * 100;
  // Ограничиваем процент для бегунка, чтобы он не вылезал
  const clampedPercent = Math.max(0, Math.min(100, percent));

  return (
    <div
      className={cn("py-8 px-4 sm:px-8 space-y-2 text-white font-light", className)}
    >
      {/* Заголовок */}
      <div className="pb-1 text-center">
        <span className="text-xl sm:text-2xl font-semibold">{title}</span>
      </div>

      {/* Описание */}
      <div className="text-center max-w-98.75 mx-auto">
        <span className="text-white/16 text-[0.875rem] sm:text-[1rem] leading-[1.5] text-center ">
          {description}
        </span>
      </div>

      <div className="pt-6 flex items-center justify-center">
        <FectiveButton className="mx-auto max-w-[46.625rem] rounded-[1.125rem] px-6 h-[3.25rem] bg-golden">
          <span className="text-[1.5rem] font-bold">{currentInfo}</span>
        </FectiveButton>
      </div>

      {/* Слайдер */}
      <div className="pt-6 pb-5">
        <div className="relative px-2">
          {/* Кликабельная зона */}
          <div
            ref={sliderRef}
            onClick={handleSliderClick}
            className="relative w-full h-12 -my-4 cursor-pointer"
          >
            {/* Трек */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1.5 bg-golden/20 rounded-full overflow-visible">
              {/* Заполненная часть */}
              <div
                className="absolute h-full bg-golden rounded-full transition-all duration-150"
                style={{ width: `${clampedPercent}%` }}
              />
            </div>

            {/* Кружки на треке */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0">
              {steps.map((step, idx) => {
                const position = (idx / (steps.length - 1)) * 100;
                return (
                  <div
                    key={idx}
                    onClick={(e) => handleStepClick(idx, e)}
                    className="absolute top-1/2 -translate-y-1/2"
                    style={{ left: `${position}%` }}
                  >
                    <div
                      className={cn(
                        "w-3 h-3 rounded-full transition-all duration-150 cursor-pointer",
                        "hover:scale-125 active:scale-95 -translate-x-1/2",
                        idx <= stepIndex ? "bg-golden" : "bg-golden/40",
                      )}
                    />
                  </div>
                );
              })}
            </div>

            {/* Большой кружок value - с drag & drop */}
            <div
              ref={thumbRef}
              className="absolute top-1/2 transition-all duration-150 cursor-grab active:cursor-grabbing"
              style={{
                left: `clamp(0%, ${clampedPercent}%, 100%)`,
              }}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
            >
              <div className="relative -translate-x-1/2 -translate-y-1/2">
                <div className="w-3 h-3 bg-white rounded-full ring-4 ring-golden ring-offset-1 ring-offset-transparent shadow-lg hover:scale-110 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Цена */}
      <div className="text-center flex items-center justify-center gap-4">
        <svg className="w-9 h-9 sm:w-12 sm:h-12" aria-hidden="true">
          <use href="/icons/sprite/sprite.svg#rub" />
        </svg>
        <span className="text-[2rem] sm:text-[2.5rem] font-bold text-white">
          {currentPrice.toLocaleString()}
        </span>
      </div>

      {/* Кнопка покупки */}
      <Button
        onClick={handleBuy}
        className="max-w-[46.625rem] w-full rounded-[1.125rem] px-3 h-[3.25rem] bg-golden hover:bg-golden/80 active:scale-95 transition-all"
      >
        <span className="text-[1.0625rem]">{buttonText}</span>
      </Button>
    </div>
  );
}
