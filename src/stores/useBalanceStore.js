// stores/useBalanceStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useBalanceStore = create(
  persist(
    (set, get) => ({
      balance: 0, // текущий баланс в рублях (или кликах, но лучше отдельно)
      
      // Добавить сумму
      addBalance: (amount) => {
        set((state) => ({ balance: state.balance + amount }));
        // Здесь потом вызов синхронизации с сервером
        // syncBalanceToServer(get().balance);
      },
      
      // Вычесть сумму (если достаточно)
      subtractBalance: (amount) => {
        const { balance } = get();
        if (balance >= amount) {
          set({ balance: balance - amount });
          return true;
        }
        return false;
      },
      
      // Установить баланс (например, после загрузки с сервера)
      setBalance: (newBalance) => set({ balance: newBalance }),
      
      // Сброс (для выхода из аккаунта)
      resetBalance: () => set({ balance: 0 }),
    }),
    {
      name: 'capital-clicker-balance', // ключ в localStorage
      getStorage: () => localStorage, // можно использовать sessionStorage
    }
  )
);

export default useBalanceStore;