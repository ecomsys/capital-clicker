// src/components/earn/EarnCard.jsx

import { cn } from "@/lib/utils";

export function EarnCard({ className, onClick, data, ...props }) {
  // Дефолтные значения, если в объекте чего-то нет
  const {
    imageSrc = "/icons/collection/non.svg",
    imageAlt = "none",
    imageClasses= "",
    social = "Вконтакте",
    bonus = "100",
  } = data || {};

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-between rounded-[1.5rem] w-full p-2 iphone:aspect-[177/218] iphone:w-44.25 iphone:h-54.5 overflow-hidden",
        "bg-[rgba(217, 217, 217, 0.02)] shadow-[0_0_0.4375rem_0_rgba(254,141,0,0.1)] transition-all duration-200",
        "text-white transition-transform hover:scale-[102%] duration-300",
        className,
      )}
      {...props}
    >
      <div className="flex flex-col h-full w-full py-4 px-3">
        {/* Контейнер картинки с фиксированными пропорциями */}
        <div className="flex-1 flex items-center justify-center ">
          <img
            src={imageSrc}
            alt={imageAlt}
            className={cn("w-18 h-18 object-contain", imageClasses)}
          />
        </div>

        {/* Контент внизу (текст + кнопка) - прижат к низу */}
        <div className="flex flex-col mt-auto pt-2">
          {/* Центрированный текст */}
          <div className="text-white text-center pb-3 text-[0.875rem] font-semibold mx-auto">
            <span>Подписаться</span>
            <br />
            <span>на </span>
            <span className="text-golden">{social}</span>
          </div>

          {/* Бонус за регистрацию */}
          <div className="flex items-center justify-center gap-3">
            <svg className="w-7.5 h-7.5" aria-hidden="true">
              <use href="/icons/sprite/sprite.svg#rub" />
            </svg>
            <span className="text-[1.25rem] font-bold text-white">
              +{bonus}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
