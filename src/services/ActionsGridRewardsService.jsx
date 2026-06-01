// src/services/actionsGridRewardsService.jsx
import useModalStore from "@/stores/useModalStore";
import { Button } from "@/components/ui/Button";
import { PrizeCard } from "@/components/prize/PrizesUi";

class ActionsGridRewardsService {
  constructor() {
    this.prizesCache = null;
  }

  async loadPrizes() {
    if (this.prizesCache) return this.prizesCache;
    try {
      const response = await fetch("/data/myPrizes.json");
      const data = await response.json();
      this.prizesCache = data.myPrizes || [];
      return this.prizesCache;
    } catch (error) {
      console.error("Ошибка загрузки призов:", error);
      return [];
    }
  }

  renderPrizesGrid(prizes) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 max-h-[67vh] overflow-y-auto scroll-hide">
        {prizes.map((prize, index) => (
          <PrizeCard key={`${prize.id}+"-"+${index}`} prize={prize} />
        ))}
      </div>
    );
  }

  renderEmptyState() {
    return (
      <div className="flex flex-col justify-between flex-1">
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 my-8">
          <div className="w-full max-w-[10.625rem] sm:max-w-[15.6875rem] aspect-[251/270]">
            <img
              src="/icons/collection/big-gift.svg"
              alt="Нет призов"
              className="w-full h-full object-cover "
            />
          </div>
          <div className="space-y-1">
            <div className="text-white text-[1.75rem] sm:text-[2rem] font-bold">
              <span>Здесь будут</span>
              <span className="text-golden"> ваши призы</span>
            </div>
            <div className="text-white/20 text-base mx-auto max-w-[15.9375rem] lg:max-w-[initial]">
              Продолжайте кликать и вы обязательно что-то выиграете
            </div>
          </div>
        </div>
        <div className="mt-auto">
          <Button
            onClick={() => useModalStore.getState().closeModal()}
            className="px-6 py-2 h-[3.25rem] w-full bg-golden rounded-[1rem] hover:bg-golden/80"
          >
            Назад
          </Button>
        </div>
      </div>
    );
  }

  async rewardsClick() {
    const { openModal } = useModalStore.getState();
    const prizes = await this.loadPrizes();
    const hasPrizes = prizes && prizes.length > 0;

    // Убираем h-full / max-h – пусть высота модалки определяется контентом
    const modalClasses = hasPrizes
      ? "w-full sm:max-w-[50.625rem] min-h-[76vh]"
      : "w-full sm:max-w-[36.75rem] min-h-[76vh]";

    const modalContent = (
      <div className="min-h-[inherit] flex flex-col py-6 sm:py-8 px-4 sm:px-8 space-y-10 text-white">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-semibold">Мои призы</h2>
        </div>
        {hasPrizes ? this.renderPrizesGrid(prizes) : this.renderEmptyState()}
      </div>
    );

    openModal({
      classes: modalClasses,
      content: modalContent,
    });
  }
}

export const actionsGridRewardsService = new ActionsGridRewardsService();
