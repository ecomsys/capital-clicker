import { useEffect, useRef } from "react";
import TreasureChest from "@/components/home/TreasureChest";
import ActionCard from "@/components/home/ActionCard";
import { useFullscreen } from "@/hooks/useFullScreen";
import { actionsGridRewardsService } from "@/services/ActionsGridRewardsService";
import { isMobile } from "@/lib/platform";
import { playSound } from "@/audio/manager";
import useChestStore from "@/stores/useChestStore";
import { useNavigate } from "react-router-dom";

export default function HomeActionsGrid() {
  const navigate = useNavigate();
  const { isFullscreen, openFullscreen } = useFullscreen();
  const timeoutRef = useRef(null);

  const progress = useChestStore((state) => state.getProgress('main'));
  const limit = useChestStore((state) => state.getLimit('main'));
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
          search: `?from=main`, 
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
      search: `?from=main`,
    });
  };

  const handleFullscreenClick = () => {
    if (!isFullscreen && isMobile()) {
       openFullscreen();
    }
  };

  return (
    <div className="w-full flex justify-center min-w-[18rem]">
      <div className="w-full sm:hidden">
        <div className="w-full grid grid-cols-3 gap-3 max-w-88.5 mx-auto">
          <TreasureChest
            onClick={handleChestClick}
            progress={chestPercent}
            className="max-w-[6.875rem] aspect-[110/88] mb-1 cursor-pointer"
          />
          <div className="max-w-[6.875rem] aspect-[110/88] mb-1"></div>
          <div className="max-w-[6.875rem] aspect-[110/88] mb-1"></div>

          <ActionCard
            onClick={handleFullscreenClick}
            to="/super-game"
            icon="crown"
            label="Супер игра"
            className="max-w-[6.875rem] aspect-[110/88]"
          />
          <ActionCard
            onClick={handleFullscreenClick}
            to="/shop"
            icon="shop"
            label="Магазин"
            className="max-w-[6.875rem] aspect-[110/88]"
          />
          <ActionCard
            onClick={() => {
              actionsGridRewardsService.rewardsClick();
              handleFullscreenClick();
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
          className="max-w-[9rem] aspect-[144/115] cursor-pointer"
        />
        <ActionCard
          to="/super-game"
          icon="crown"
          onClick={handleFullscreenClick}
          label="Супер игра"
          className="max-w-[9rem] aspect-[144/115]"
        />
        <ActionCard
          to="/shop"
          icon="shop"
          onClick={handleFullscreenClick}
          label="Магазин"
          className="max-w-[9rem] aspect-[144/115]"
        />
        <ActionCard
          onClick={() => {
            actionsGridRewardsService.rewardsClick();
            handleFullscreenClick();
          }}
          icon="trophy"
          label="Мои призы"
          className="max-w-[9rem] aspect-[144/115]"
        />
      </div>
    </div>
  );
}