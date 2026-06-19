// src/components/Friends/EmptyFriendsState.jsx

export default function EmptyFriendsState({ className }) {
  return (
    <div className={className}>
      <div className="flex flex-col h-full w-full items-center justify-center text-center pt-6">
        {/* Картинка с aspect-ratio 516/260 */}
        <div className="flex-1 relative w-full max-w-[32.25rem] lg:max-w-[38rem] min-h-[3rem] max-h-[18rem] sm:mt-0">
          <img
            src="/images/webp/friend-hands.webp"
            alt="Нет друзей"
            className="absolute inset-0 w-full h-full object-contain scale-[140%] sm:scale-[100%]"
          />
        </div>

        {/* Заголовок */}
        <h3 className="shrink-0 text-2xl sm:text-[2rem] font-bold text-white pt-6 sm:pt-0 mt-10 xs:mt-4">
          Приглашай друзей <br />и зарабатывай
        </h3>

        {/* Описание */}
        <p className="shrink-0 text-sm sm:text-base text-[#666] mt-1 sm:mt-3 max-w-[16.25rem] sm:max-w-[18.1875rem]">
          Поделись ссылкой с другом и получи награду за его регистрацию
        </p>

        {/* Награда */}
        <div className="flex-1 flex items-center justify-center gap-4  max-h-[4rem]  sm:max-h-[10rem] my-2">
          <svg className="w-9 h-9 sm:w-12 sm:h-12" aria-hidden="true">
            <use href="/icons/sprite/sprite.svg#rub" />
          </svg>
          <span className="text-[2rem] sm:text-[2.5rem] font-bold text-white">
            +10
          </span>
        </div>
      </div>
    </div>
  );
}
