// src/components/Clans/EmptyClansState.jsx

import { cn } from "@/lib/utils";

export default function EmptyClansState({ className }) {
  return (
    <div
      className={cn("flex flex-col w-full items-center justify-center text-center", className)}
    >
      {/* Картинка с aspect-ratio 516/260 */}
      <div className="mt-8 mb-8 sm:my-16 w-full max-w-[42rem] aspect-[516/260] mx-auto">
        <img
          src="/images/webp/sand-clock.webp"
          alt="Нет кланов"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Заголовок */}
      <h3 className="text-2xl sm:text-[2rem] font-bold text-white">
       <span className="text-accent">Скоро</span> будет доступно
      </h3>

      {/* Описание */}
      <p className="mt-3 mb-20 text-sm sm:text-base text-[#666] max-w-[16.25rem] sm:max-w-[18.1875rem]">
        Эта функция находится в разработке и скоро станет доступна
      </p>
    
    </div>
  );
}
