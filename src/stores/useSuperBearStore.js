// src/stores/useSuperBearStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const SUPER_GAME_MODES = {
  ONLINE: "online",
  BATTERY: "battery",
};

const START_ENERGY = 10000;
const DEFAULT_SPIN_SPEED = 0.3;
const REQUIRED_PRIZE_CLICKS = 100;

const useSuperBearStore = create(
  persist(
    (set, get) => ({
      clicks: 0,
      batteryClicks: 0,
      energy: START_ENERGY,
      spinSpeed: DEFAULT_SPIN_SPEED,
      superGameMode: SUPER_GAME_MODES.ONLINE,

      currentPrizeClicks: 0,
      requiredPrizeClicks: REQUIRED_PRIZE_CLICKS,

      // ---------- addClick возвращает { prizeAchieved } ----------
      addClick: () => {
        const mode = get().superGameMode;
        if (mode === SUPER_GAME_MODES.ONLINE) {
          let prizeAchieved = false;
          set((state) => {
            const newPrize = state.currentPrizeClicks + 1;
            if (newPrize >= state.requiredPrizeClicks) {
              prizeAchieved = true;
              return {
                clicks: state.clicks + 1,
                currentPrizeClicks: 0,
              };
            }
            return {
              clicks: state.clicks + 1,
              currentPrizeClicks: newPrize,
            };
          });
          return { prizeAchieved };
        } else {
          // батарейный режим – только увеличиваем batteryClicks
          set((state) => ({ batteryClicks: state.batteryClicks + 1 }));
          return { prizeAchieved: false };
        }
      },

      resetClicks: () => set({ clicks: 0, batteryClicks: 0 }),

      sendBatteryClicks: () => {
        const { batteryClicks, currentPrizeClicks, requiredPrizeClicks } =
          get();
        if (batteryClicks === 0) {
          set({ superGameMode: SUPER_GAME_MODES.ONLINE });
          return { transferred: 0, prizeAchieved: false };
        }

        let newPrize = currentPrizeClicks + batteryClicks;
        let prizeAchieved = false;
        if (newPrize >= requiredPrizeClicks) {
          newPrize = 0;
          prizeAchieved = true;
        }

        set({
          clicks: get().clicks + batteryClicks,
          batteryClicks: 0,
          currentPrizeClicks: newPrize,
          superGameMode: SUPER_GAME_MODES.ONLINE,
        });
        return { transferred: batteryClicks, prizeAchieved };
      },

      setSpinSpeed: (speed) => set({ spinSpeed: speed }),
      decrementEnergy: () =>
        set((state) => ({ energy: Math.max(state.energy - 1, 0) })),
      addEnergy: (amount) =>
        set((state) => ({
          energy: Math.min(state.energy + amount, START_ENERGY),
        })),

      setSuperGameMode: (mode) => {
        if (Object.values(SUPER_GAME_MODES).includes(mode))
          set({ superGameMode: mode });
      },
      toggleSuperGameMode: () => {
        set((state) => ({
          superGameMode:
            state.superGameMode === SUPER_GAME_MODES.ONLINE
              ? SUPER_GAME_MODES.BATTERY
              : SUPER_GAME_MODES.ONLINE,
        }));
      },

      getPrizeProgress: () => {
        const { currentPrizeClicks, requiredPrizeClicks } = get();
        return Math.min((currentPrizeClicks / requiredPrizeClicks) * 100, 100);
      },
      setRequiredPrizeClicks: (clicks) => set({ requiredPrizeClicks: clicks }),
      resetPrizeProgress: () => set({ currentPrizeClicks: 0 }),

      resetSuperBear: () =>
        set({
          clicks: 0,
          batteryClicks: 0,
          energy: START_ENERGY,
          spinSpeed: DEFAULT_SPIN_SPEED,
          superGameMode: SUPER_GAME_MODES.ONLINE,
          currentPrizeClicks: 0,
          requiredPrizeClicks: REQUIRED_PRIZE_CLICKS,
        }),
    }),
    { name: "capital-clicker-super-bear", getStorage: () => localStorage },
  ),
);

export default useSuperBearStore;
