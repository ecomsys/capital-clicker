// src/components/Friends/EmptyFriendsState.jsx

import { cn } from "@/lib/utils";

export default function EmptyFriendsState({ className }) {
  return (
    <div
      className={cn("flex flex-col w-full items-center justify-center text-center", className)}
    >
      {/* Картинка с aspect-ratio 516/260 */}
      <div className="relative w-full max-w-[32.25rem] aspect-[516/260] mt-2 sm:mt-0">
        <img
          src="/images/webp/friend-hands.webp"
          alt="Нет друзей"
          className="absolute inset-0 w-full h-auto object-contain scale-145 sm:scale-100"
        />
      </div>

      {/* Заголовок */}
      <h3 className="text-2xl sm:text-[2rem] font-bold text-white mt-16 sm:mt-8">
        Приглашай друзей <br />и зарабатывай
      </h3>

      {/* Описание */}
      <p className="text-sm sm:text-base text-[#666] mt-3 max-w-[16.25rem] sm:max-w-[18.1875rem]">
        Поделись ссылкой с другом и получи награду за его регистрацию
      </p>

      {/* Награда */}
      <div className="flex items-center justify-center gap-4 mt-6 mb-8 sm:my-12">
        <svg className="w-9 h-9 sm:w-12 sm:h-12" aria-hidden="true">
          <use href="/icons/sprite/sprite.svg#rub" />
        </svg>
        <span className="text-[2rem] sm:text-[2.5rem] font-bold text-white">
          +10
        </span>
      </div>
    </div>
  );
}
