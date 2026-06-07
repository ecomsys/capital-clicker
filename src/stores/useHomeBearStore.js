// src/stores/useHomeBearStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const START_ENERGY = 10000;

const useHomeBearStore = create(
  persist(
    (set) => ({
      // Состояния
      progress: 0,
      prizeIndex: 0,
      clicks: 0,
      energy: START_ENERGY,

      // Действия
      incrementProgress: (amount = 1) => {
        set((state) => ({
          progress: Math.min(state.progress + amount, 100),
        }));
      },

      resetProgress: () => set({ progress: 0 }),

      incrementPrizeIndex: () => {
        set((state) => ({
          prizeIndex: state.prizeIndex + 1,
        }));
      },

      addClick: () => set((state) => ({ clicks: state.clicks + 1 })),

      decrementEnergy: () =>
        set((state) => ({
          energy: Math.max(state.energy - 1, 0),
        })),

      addEnergy: (amount) =>
        set((state) => ({
          energy: Math.min(state.energy + amount, START_ENERGY),
        })),

      resetHomeBear: () =>
        set({
          progress: 0,
          prizeIndex: 0,
          clicks: 0,
          energy: START_ENERGY,
        }),
    }),
    {
      name: "capital-clicker-home-bear",
      getStorage: () => localStorage,
    },
  ),
);

export default useHomeBearStore;
