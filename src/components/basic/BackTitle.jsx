// src/components/basic/BackTitle.jsx

import { cn } from "@/lib/utils";

export function BackTitle({ 
  title, 
  onBack, 
  className, 
  rightSlot = null,
  titleClassName 
}) {
  return (
    <div className={cn(
      "relative flex items-center justify-center",
      className
    )}>
      {/* BackButton - абсолютно позиционирован, не ломает центровку */}
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 text-white hover:text-golden transition-colors"
          aria-label="Назад"
        >
          <svg
            className="w-[2rem] h-[2rem] sm:w-[2.5rem] sm:h-[2.5rem] lg:w-[3rem] lg:h-[3rem]"
            aria-hidden="true"
          >
            <use href="/icons/sprite/sprite.svg#left" />
          </svg>
        </button>
      )}

      {/* Заголовок — строго по центру */}
      <h2 className={cn(
        "text-[1.25rem] sm:text-[1.5rem] lg:text-[2rem] font-semibold text-center",
        titleClassName
      )}>
        {title}
      </h2>

      {/* Слот справа (опционально) — для баланса, если нужно */}
      {rightSlot && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
          {rightSlot}
        </div>
      )}
    </div>
  );
}