// src/components/supergame/SuperGameActionsGrid.jsx

import TreasureChest from "@/components/supergame/TreasureChest";
import ActionCard from "@/components/home/ActionCard";
import { rulesService } from "@/services/RulesService";
import { actionsGridRewardsService } from "@/services/ActionsGridRewardsService";
import { useFullscreen } from "@/hooks/useFullScreen";
import { isMobile } from "@/lib/platform";
import { useRef, useEffect } from "react";
import { playSound } from "@/audio/manager";
import { useNavigate } from "react-router-dom";
import useChestStore from "@/stores/useChestStore";

export default function SuperGameActionsGrid() {
  const navigate = useNavigate();
  const { isFullscreen, openFullscreen } = useFullscreen();
  const timeoutRef = useRef(null);

  const progress = useChestStore((state) => state.getProgress("superGame"));
  const limit = useChestStore((state) => state.getLimit("superGame"));
  const isCompleted = progress >= limit;
  const chestPercent = (progress / limit) * 100;

  // Автоматический переход при достижении лимита
  useEffect(() => {
    if (isCompleted) {
      playSound("/sounds/chest-collect.mp3", { volume: 0.5 });
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        navigate({
          pathname: "/wheel",
          search: `?from=superGame`,
        });
        timeoutRef.current = null;
      }, 1500);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isCompleted, navigate]);

  // Клик по сундуку – переход всегда (даже если не собран)
  const handleChestClick = () => {
    navigate({
      pathname: "/wheel",
      search: `?from=superGame`,
    });
  };

  const handleFullscreenClick = () => {
    if (!isFullscreen && isMobile()) {
      openFullscreen();
    }
  };

  return (
    <div className="w-full flex justify-center min-w-[18rem]">
      {/* мобильная и десктопная верстка без изменений */}
      <div className="w-full sm:hidden">
        <div className="w-full grid grid-cols-3 gap-3 max-w-88.5 mx-auto">
          <TreasureChest
            onClick={handleChestClick}
            progress={chestPercent}
            className="max-w-[6.875rem] aspect-[110/69]"
          />
          <div className="max-w-[6.875rem] aspect-[110/69]"></div>
          <div className="max-w-[6.875rem] aspect-[110/69]"></div>

          <ActionCard
            onClick={handleFullscreenClick}
            to="/shop"
            icon="shop"
            label="Магазин"
            className="max-w-[6.875rem] aspect-[110/88]"
          />
          <ActionCard
            onClick={() => {
              handleFullscreenClick();
              rulesService.openRulesModal("/data/superRules.json", true);
            }}
            icon="info"
            label="Правила"
            className="border-white text-white max-w-[6.875rem] aspect-[110/88]"
          />
          <ActionCard
            onClick={() => {
              handleFullscreenClick();
              actionsGridRewardsService.rewardsClick();
            }}
            icon="trophy"
            label="Мои призы"
            className="max-w-[6.875rem] aspect-[110/88]"
          />
        </div>
      </div>

      <div className="hidden sm:flex sm:gap-4 w-full mx-auto max-w-159.5">
        <TreasureChest
          onClick={handleChestClick}
          progress={chestPercent}
          className="max-w-[9rem] aspect-[144/115]"
        />
        <ActionCard
          onClick={handleFullscreenClick}
          to="/shop"
          icon="shop"
          label="Магазин"
          className="max-w-[9rem] aspect-[144/115]"
        />
        <ActionCard
          onClick={() => {
            handleFullscreenClick();
            rulesService.openRulesModal("/data/superRules.json", true);
          }}
          icon="info"
          label="Правила"
          className="max-w-[9rem] aspect-[144/115] border-white text-white"
        />
        <ActionCard
          onClick={() => {
            handleFullscreenClick();
            actionsGridRewardsService.rewardsClick();
          }}
          icon="trophy"
          label="Мои призы"
          className="max-w-[9rem] aspect-[144/115]"
        />
      </div>
    </div>
  );
}
