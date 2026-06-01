// src/components/home/Header.jsx
import { GlassButton } from "@/components/basic/GlassButton";
import { GlassMessage } from "@/components/basic/GlassMessage";
import { rulesService } from "@/services/RulesService";

export default function HomeHeader({
  userBalance = 7092,
  winner = {
    name: "Иван",
    win: "1000",
  },
}) {

  return (
    <div className="space-y-2 sm:space-y-4 lg:space-y-5">
      <div>
        {/* Мобилка/планшет */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:gap-5 lg:hidden">
          <GlassButton
            className="text-white text-[1rem] justify-start font-semibold gap-2 px-2 sm:gap-3 sm:px-3"
            href="/deposit"
            icon="rub"
          >
            <span>{userBalance.toLocaleString()}</span>
          </GlassButton>
          <GlassButton
            className="text-white"
            onClick={() => rulesService.openRulesModal("/data/rules.json")}
            icon="info"
          />
          <GlassButton className="text-white" href="/profile" icon="profile" />
        </div>

        {/* Десктоп */}
        <div className="hidden lg:flex lg:justify-between gap-2 sm:gap-4 lg:gap-5">
          <GlassButton
            className="text-white justify-normal text-[1.5rem] font-bold min-w-[14.75rem]"
            href="/deposit"
            icon="rub"
          >
            {userBalance.toLocaleString()}
          </GlassButton>
          <div className="flex gap-2 sm:gap-4 lg:gap-5">
            <GlassButton
              className="text-white px-8"
              onClick={() => rulesService.openRulesModal("/data/rules.json")}
              icon="info"
            />
            <GlassButton
              className="text-white px-8"
              href="/profile"
              icon="profile"
            />
          </div>
        </div>
      </div>

      {/* Второй ряд – сообщение о выигрыше */}
      <GlassMessage className="font-bold text-white text-center">
        <span>
          <span className="text-golden">{winner.name}</span> выиграл{" "}
          {winner.win} <span>рублей</span>
        </span>
      </GlassMessage>
    </div>
  );
}
