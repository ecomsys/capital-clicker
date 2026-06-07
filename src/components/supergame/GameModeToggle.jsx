// src/components/super/GameModeToggle.jsx
import { cn } from "@/lib/utils";
import useSuperBearStore, { SUPER_GAME_MODES } from "@/stores/useSuperBearStore";
import { Button } from "../ui/Button";

export default function GameModeToggle({ className = "" }) {
  const { superGameMode, setSuperGameMode } = useSuperBearStore();

  return (
    <div className={cn(
      "flex bg-tile rounded-full",
      className
    )}>
      {/* Кнопка "Онлайн" */}
      <Button
        onClick={() => setSuperGameMode(SUPER_GAME_MODES.ONLINE)}
        className={cn(
          "flex-1 text-sm transition-all duration-200",
          "flex items-center justify-center rounded-full h-[2.125rem]",
          
          // Активное состояние
          superGameMode === SUPER_GAME_MODES.ONLINE
            ? "bg-golden text-white shadow-lg"
            : "text-[#8c8c8c] hover:text-white hover:bg-tile"
        )}
      >      
        <span>Онлайн</span>
      </Button>

      {/* Кнопка "Аккумулятор" */}
      <Button
        onClick={() => setSuperGameMode(SUPER_GAME_MODES.BATTERY)}
        className={cn(
          "flex-1 text-sm transition-all duration-200 rounded-full h-[2.125rem]",
          "flex items-center justify-center",
          
          // Активное состояние
          superGameMode === SUPER_GAME_MODES.BATTERY
            ?  "bg-golden text-white shadow-lg"
            : "text-[#8c8c8c] hover:text-white hover:bg-tile"
        )}
      >
      
        <span>Аккумулятор</span>
      </Button>
    </div>
  );
}