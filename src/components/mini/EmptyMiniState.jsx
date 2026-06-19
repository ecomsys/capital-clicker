// src/components/mini/EmptyMiniState.jsx
import { cn } from "@/lib/utils";

export default function EmptyMiniState({ className }) {
  return (
    <div
      className={cn(
        "flex flex-col w-full items-center justify-center text-center",
        className
      )}
    >
      {/* Картинка - резиновая, занимает всё доступное место */}
      <div className="w-full h-full max-h-[28vh] min-h-[12rem] aspect-[516/260] flex items-center justify-center">
        <img
          src="/images/webp/sand-clock.webp"
          alt="Нет мини игр"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Заголовок */}
      <h3 className="flex-shrink-0 text-2xl sm:text-[2rem] font-bold text-white mt-4">
        <span className="text-accent">Скоро</span> будет доступно
      </h3>

      {/* Описание */}
      <p className="flex-shrink-0 mt-3 text-sm sm:text-base text-[#666] max-w-[16.25rem] sm:max-w-[18.1875rem]">
        Эта функция находится в разработке и скоро станет доступна
      </p>
    </div>
  );
}