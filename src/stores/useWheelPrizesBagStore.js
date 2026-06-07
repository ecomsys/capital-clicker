import { create } from "zustand";
import { persist } from "zustand/middleware"; // ← Импортируем persist

const useWheelPrizesBagStore = create(
  persist(
    (set, get) => ({
      availablePrizes: [],
      allPrizes: [],

      // Инициализация полного набора призов
      initializePrizes: (prizes) => {
        const { allPrizes } = get();

        // ВАЖНО: Если призы уже есть в хранилище, мы их НЕ перезаписываем!
        // Иначе при каждом заходе на страницу мешок будет сбрасываться.
        if (allPrizes.length > 0) {
          return;
        }

        console.log("[PrizeBag] Инициализация нового набора призов");
        set({
          allPrizes: [...prizes],
          availablePrizes: [...prizes],
        });
      },

      // Получить случайный приз из мешка
      getRandomPrize: () => {
        const { availablePrizes, allPrizes } = get();

        // Если мешок пустой - восстанавливаем его из allPrizes
        if (availablePrizes.length === 0) {
          console.log("[PrizeBag] Мешок пустой, восстанавливаем полный набор");
          set({ availablePrizes: [...allPrizes] });
          return get().getRandomPrize(); // Рекурсивно берём приз из восстановленного мешка
        }

        // Выбираем случайный индекс
        const randomIndex = Math.floor(Math.random() * availablePrizes.length);
        const selectedPrize = availablePrizes[randomIndex];

        // Удаляем выбранный приз из мешка
        const newAvailable = [...availablePrizes];
        newAvailable.splice(randomIndex, 1);

        console.log(
          `Приз из мешка взят, "${selectedPrize.title}" остались : "${newAvailable.map((p) => p.title).join(" | ")}", осталось: ${newAvailable.length}/${allPrizes.length}`,
        );

        // Обновляем стейт (persist автоматически сохранит это в localStorage)
        set({ availablePrizes: newAvailable });

        return selectedPrize;
      },

      // Сброс мешка до полного набора (например, по кнопке админа или при новом дне)
      resetBag: () => {
        const { allPrizes } = get();
        set({ availablePrizes: [...allPrizes] });
        console.log("[PrizeBag] Мешок вручную сброшен до полного набора");
      },

      // Опционально: метод для полной очистки хранилища (если призы на бэке изменились)
      clearStorage: () => {
        set({ availablePrizes: [], allPrizes: [] });
        console.log("[PrizeBag] Хранилище очищено");
      },
    }),
    {
      name: "capital-clicker-prize-bag", // Уникальное имя ключа в localStorage
      // partialize: (state) => ({ availablePrizes: state.availablePrizes, allPrizes: state.allPrizes }), // Можно указать, что именно сохранять (по умолчанию сохраняется всё)
    },
  ),
);

export default useWheelPrizesBagStore;
