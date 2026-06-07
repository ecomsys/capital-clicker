// stores/useChestStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Лимиты для каждого сундука – можно менять под свои нужды
const CHEST_LIMITS = {
  main: 5000, // для главной страницы
  superGame: 5000, // для супер-игры (пример другого значения)
};

const useChestStore = create(
  persist(
    (set, get) => ({
      // Прогресс для каждого сундука (0 .. лимит)
      chests: {
        main: 0,
        superGame: 0,
      },

      // Оставшиеся призы для колеса (по каждому сундуку)
      wheelRemainingPrizes: {
        main: [],
        superGame: [],
      },

      // Увеличить прогресс на amount (не больше лимита)
      incrementProgress: (chestId, amount) =>
        set((state) => {
          const current = state.chests[chestId] || 0;
          const limit = CHEST_LIMITS[chestId] ?? 150;
          const newValue = Math.min(current + amount, limit);
          return {
            chests: { ...state.chests, [chestId]: newValue },
          };
        }),

      // Установить конкретное значение
      setProgress: (chestId, value) =>
        set((state) => {
          const limit = CHEST_LIMITS[chestId] ?? 150;
          return {
            chests: { ...state.chests, [chestId]: Math.min(value, limit) },
          };
        }),

      // Проверить, собран ли сундук (прогресс >= лимита)
      isChestCompleted: (chestId) => {
        const progress = get().chests[chestId] || 0;
        const limit = CHEST_LIMITS[chestId] ?? 150;
        return progress >= limit;
      },

      // Получить текущий прогресс
      getProgress: (chestId) => get().chests[chestId] || 0,

      // Получить лимит для сундука (для отображения "150/150")
      getLimit: (chestId) => CHEST_LIMITS[chestId] ?? 150,

      // Сбросить один сундук
      resetChest: (chestId) =>
        set((state) => ({
          chests: { ...state.chests, [chestId]: 0 },
        })),

      // Сбросить всё
      resetAll: () => set({ chests: { main: 0, superGame: 0 } }),

    }),
    {
      name: "capital-clicker-chest-progress", // ключ в localStorage
    },
  ),
);

export default useChestStore;
