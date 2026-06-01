// src/stores/useSettingsStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const SUPER_GAME_MODES = {
  ONLINE: "online",
  BATTERY: "battery",
};

export const SUPPORTED_LANGUAGES = {
  RU: "ru",
  EN: "en",
  // можно добавить другие
};

const useSettingsStore = create(
  persist(
    (set, get) => ({
      //===============================================================================================
      //    Настройки звука
      //===============================================================================================
      soundEnabled: true,
      toggleSound: () =>
        set((state) => ({ soundEnabled: !state.soundEnabled })),
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),

      //===============================================================================================
      //    Режим супер игры
      //===============================================================================================
      superGameMode: SUPER_GAME_MODES.ONLINE,
      setSuperGameMode: (mode) => {
        if (Object.values(SUPER_GAME_MODES).includes(mode)) {
          set({ superGameMode: mode });
        }
      },
      toggleSuperGameMode: () => {
        set((state) => ({
          superGameMode:
            state.superGameMode === SUPER_GAME_MODES.ONLINE
              ? SUPER_GAME_MODES.BATTERY
              : SUPER_GAME_MODES.ONLINE,
        }));
      },
      
      //===============================================================================================
      //   Выбор приза для суперигры
      //===============================================================================================
      selectedSuperGamePrize: null,
      setSelectedSuperGamePrize: (prize) =>
        set({ selectedSuperGamePrize: prize }),
      clearSelectedSuperGamePrize: () => set({ selectedSuperGamePrize: null }),
      hasSelectedSuperGamePrize: () => !!get().selectedSuperGamePrize,

      //===============================================================================================
      //    Язык интерфейса
      //===============================================================================================
      language: SUPPORTED_LANGUAGES.RU,
      setLanguage: (lang) => {
        if (Object.values(SUPPORTED_LANGUAGES).includes(lang)) {
          set({ language: lang });
        }
      },
    }),
    {
      name: "capital-clicker-settings",
      partialize: (state) => ({
        language: state.language,
        soundEnabled: state.soundEnabled,
        superGameMode: state.superGameMode,
        superGamePrize: state.selectedSuperGamePrize,
      }),
    },
  ),
);

export default useSettingsStore;
