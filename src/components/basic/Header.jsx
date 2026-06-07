// src/components/Header.jsx
import { GlassButton } from "@/components/basic/GlassButton";
import { GlassMessage } from "@/components/basic/GlassMessage";
import { rulesService } from "@/services/RulesService";

// ресет
import { resetAllProgress } from "@/services/resetService";

// Импорты для тултипа
import { withTooltip } from "@/components/ui/tooltip";

// импортируем переменные рекламы и приманки пока из файла
import { lastWinner } from "@/constants/honeyPot.site.js";

export default function Header({ userBalance = 0 }) {
  const displayBalance = userBalance ?? 0;

  const handleReset = () => {
    if (confirm("Вы уверены? Весь прогресс будет потерян!")) {
      resetAllProgress();
      // Можем перезагрузить страницу, чтобы все компоненты перерендерились с нуля
      window.location.reload();
    }
  };

  // Общая структура кнопки с тултипом

  return (
    <div className="space-y-2 sm:space-y-4 lg:space-y-5">
      {/* Мобилка/планшет */}
      <div className="grid grid-cols-4 gap-2 sm:gap-4 lg:gap-5 lg:hidden">
        {withTooltip(
          <GlassButton
            className="user-balance text-white text-[1rem] justify-start font-semibold gap-2 px-2 sm:gap-3 sm:px-3"
            href="/deposit"
            icon="rub"
          >
            <span>{displayBalance.toLocaleString()}</span>
          </GlassButton>,
          "Пополнить баланс",
        )}

        {withTooltip(
          <GlassButton
            className="text-white px-8"
            onClick={handleReset}
            icon="close"
          />,
          "Сбросить прогресс (тест)",
        )}

        {withTooltip(
          <GlassButton
            className="text-white"
            onClick={() => rulesService.openRulesModal("/data/rules.json")}
            icon="info"
          />,
          "Правила игры",
        )}

        {withTooltip(
          <GlassButton className="text-white" href="/profile" icon="profile" />,
          "Профиль",
        )}
      </div>

      {/* Десктоп */}
      <div className="hidden lg:flex lg:justify-between gap-2 sm:gap-4 lg:gap-5">
        {withTooltip(
          <GlassButton
            className="user-balance text-white justify-normal text-[1.5rem] font-bold min-w-[14.75rem]"
            href="/deposit"
            icon="rub"
          >
            {displayBalance.toLocaleString()}
          </GlassButton>,
          "Пополнить баланс",
        )}

        <div className="flex gap-2 sm:gap-4 lg:gap-5">
          {withTooltip(
            <GlassButton
              className="text-white px-8"
              onClick={handleReset}
              icon="close"
            />,
            "Сбросить прогресс (тест)",
          )}

          {withTooltip(
            <GlassButton
              className="text-white px-8"
              onClick={() => rulesService.openRulesModal("/data/rules.json")}
              icon="info"
            />,
            "Правила игры",
          )}

          {withTooltip(
            <GlassButton
              className="text-white px-8"
              href="/profile"
              icon="profile"
            />,
            "Профиль",
          )}
        </div>
      </div>

      {/* Второй ряд – сообщение о выигрыше */}
      <GlassMessage className="font-bold text-white text-center">
        <span>
          <span className="text-golden">{lastWinner.name}</span> выиграл{" "}
          {lastWinner.win} <span>рублей</span>
        </span>
      </GlassMessage>
    </div>
  );
}
