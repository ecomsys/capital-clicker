// src/components/basic/AdBanner.jsx

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
// import { Link } from "react-router-dom";
// ресет
import { resetAllProgress } from "@/services/resetService";

/**
 * Компонент рекламного баннера
 * Используется для отображения рекламы со ссылкой
 *
 * @param {Object} props
 * @param {string} props.href - Ссылка для перехода по баннеру
 * @param {React.ReactNode} props.children - Содержимое баннера
 * @param {string} [props.className=""] - Дополнительные классы для стилизации
 * @param {boolean} [props.openInNewTab=true] - Открывать в новой вкладке
 * @param {Function} [props.onTrackClick] - Отслеживание кликов
 */

export const AdBanner = forwardRef(
  (
    {
      href = "https::/example.com",
      title,
      imageSrc,
      className = "",
      children,
      // onClick,
      ...props
    },
    ref,
  ) => {
    const baseStyles = cn(
      "block rounded-[0.5rem] overflow-hidden",
      "bg-[rgb(255,255,255,0.035)] hover:bg-white/5 transition-all duration-200",
      "h-[2.65rem] sm:h-[4.375rem]",
      className,
    );

    const handleReset = () => {
      if (confirm("Вы уверены? Весь прогресс будет потерян!")) {
        resetAllProgress();
        // Можем перезагрузить страницу, чтобы все компоненты перерендерились с нуля
        window.location.reload();
      }
    };

    console.log(href);

    const content = (
      <div className="relative w-full h-full">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[1.25rem] uppercase text-white/30 font-medium">
            {title}
          </span>
        </div>
        {imageSrc && (
          <img
            src={imageSrc}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        )}
        {children}
      </div>
    );

    const combinedClassName = cn(baseStyles);

    // if (href) {
    //   return (
    //     <Link to={href} className={combinedClassName} ref={ref} {...props}>
    //       {content}
    //     </Link>
    //   );
    // }

    return (
      <div
        onClick={handleReset}
        className={combinedClassName}
        ref={ref}
        {...props}
      >
        {content}
      </div>
    );
  },
);

AdBanner.displayName = "AdBanner";
