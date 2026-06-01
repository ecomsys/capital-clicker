// src/components/home/HomeActionsGrid.jsx

import TreasureChest from "@/components/home/TreasureChest";
import ActionCard from "@/components/home/ActionCard";

import { actionsGridRewardsService } from "@/services/ActionsGridRewardsService";

export default function HomeActionsGrid({ onChestCollect }) {
  return (
    <div className="w-full flex justify-center min-w-[18rem]">
      {/* Мобилка: грид 1 ряд — 1 колонка, 2 ряд — 3 колонки */}
      <div className="w-full sm:hidden">
        <div className="w-full grid grid-cols-3 gap-3 max-w-88.5 mx-auto">
          {/* Первый ряд: сундук в первой колонке, остальные две пустые */}
          <TreasureChest
            onCollect={onChestCollect}
            className="max-w-[6.875rem] aspect-[110/88] mb-2"
          />
          <div className="max-w-[6.875rem] aspect-[110/88] mb-2"></div>
          <div className="max-w-[6.875rem] aspect-[110/88] mb-2"></div>

          {/* Второй ряд: три карточки по колонкам */}
          <ActionCard
            to="/prize-selection"
            icon="crown"
            label="Супер игра"
            className="max-w-[6.875rem] aspect-[110/88]"
          />
          <ActionCard
            to="/shop"
            icon="shop"
            label="Магазин"
            className="max-w-[6.875rem] aspect-[110/88]"
          />
          <ActionCard
            onClick={() => actionsGridRewardsService.rewardsClick()}
            icon="trophy"
            label="Мои призы"
            className="max-w-[6.875rem] aspect-[110/88]"
          />
        </div>
      </div>

      {/* Десктоп: все 4 карточки в ряд по центру */}
      <div className="hidden sm:flex sm:gap-4">
        <TreasureChest
          onCollect={onChestCollect}
          className="max-w-[9rem] aspect-[144/115]"
        />
        <ActionCard
          to="/prize-selection"
          icon="crown"
          label="Супер игра"
          className="max-w-[9rem] aspect-[144/115]"
        />
        <ActionCard
          to="/shop"
          icon="shop"
          label="Магазин"
          className="max-w-[9rem] aspect-[144/115]"
        />
        <ActionCard
          onClick={() => actionsGridRewardsService.rewardsClick()}
          icon="trophy"
          label="Мои призы"
          className="max-w-[9rem] aspect-[144/115]"
        />
      </div>
    </div>
  );
}
