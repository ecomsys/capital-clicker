// src/stores/usePrizeStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const usePrizeStore = create(
  persist(
    (set, get) => ({
      selectedPrize: null,
      setSelectedPrize: (prize) => set({ selectedPrize: prize }),
      clearSelectedPrize: () => set({ selectedPrize: null }),
      hasSelectedPrize: () => !!get().selectedPrize,
    }),
    {
      name: 'capital-clicker-selected-prize',
      getStorage: () => localStorage,
    }
  )
);

export default usePrizeStore;