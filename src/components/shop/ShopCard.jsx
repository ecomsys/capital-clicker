// src/components/shop/ShopCard.jsx

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button"; // путь к вашему компоненту Button

export function ShopCard({ className, onClick, children, data, ...props }) {
  // Дефолтные значения, если в объекте чего-то нет
  const {
    imageSrc = "/icons/collection/non.svg",
    imageAlt = "none",
    title = "Отключить рекламу",
    buttonText = "100 ₽/день",
    buttonIcon = "cart",
    showButton = true,
    customButton = null,
    imageIcon = "",
    imageIconClassName,
  } = data || {};

  // Функция для рендера кнопки
  const renderButton = () => {
    if (customButton) return customButton;
    if (!showButton) return null;

    return (
      <Button
        onClick={onClick}
        className="w-full bg-golden hover:bg-golden/80 text-white rounded-full h-[2.4rem]"
      >
        {buttonIcon && (
          <svg className="w-4 h-4" aria-hidden="true">
            <use href={`/icons/sprite/sprite.svg#${buttonIcon}`} />
          </svg>
        )}
        <span>{buttonText}</span>
      </Button>
    );
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-between rounded-[1.5rem] w-full p-2 xss:aspect-[173/224] xss:w-43.25 xss:h-56 overflow-hidden",
        "bg-[rgba(217, 217, 217, 0.02)] shadow-[0_0_0.4375rem_0_rgba(254,141,0,0.1)] transition-all duration-200",
        "border-t border-l border-golden",
        "text-golden transition-transform hover:scale-[102%] duration-300",
        className,
      )}
      {...props}
    >
      {children || (
        <div className="flex flex-col h-full w-full ">
          {/* Контейнер картинки с фиксированными пропорциями */}
          <div className="flex-1 flex items-center justify-center p-4 min-h-0 relative">
            <img
              src={imageSrc}
              alt={imageAlt}
              className="w-20 h-20 object-contain"
            />

            {/* Абсолютно позиционированный лейбл X2 к примеру*/}
            {imageIcon && (
              <div
                className={cn("absolute top-1 right-6 z-5", imageIconClassName)}
              >
                <svg className="w-10 h-10 text-white">
                  <use href={`/icons/sprite/sprite.svg#${imageIcon}`} />
                </svg>
              </div>
            )}
          </div>

          {/* Контент внизу (текст + кнопка) - прижат к низу */}
          <div className="flex flex-col mt-auto pt-2">
            {/* Центрированный текст */}
            <div className="text-white text-center pb-3 text-[0.875rem] font-semibold max-w-[8rem] mx-auto">
              <span>{title}</span>
            </div>

            {/* Кнопка */}
            {renderButton()}
          </div>
        </div>
      )}
    </div>
  );
}
