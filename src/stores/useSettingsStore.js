// src/stores/useSettingsStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const SUPPORTED_LANGUAGES = {
  RU: "ru",
  EN: "en",
};

const CURRENT_LANGUAGE = SUPPORTED_LANGUAGES.RU;

const useSettingsStore = create(
  persist(
    (set) => ({
      // ========== ЗВУК ==========
      soundEnabled: true,
      toggleSound: () =>
        set((state) => ({ soundEnabled: !state.soundEnabled })),
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),

      // ========== ЯЗЫК ==========
      language: CURRENT_LANGUAGE,
      setLanguage: (lang) => {
        if (Object.values(SUPPORTED_LANGUAGES).includes(lang)) {
          set({ language: lang });
        }
      },

      resetSettings: () =>
        set({
          soundEnabled: true,
          language: SUPPORTED_LANGUAGES.RU,
        }),
    }),
    {
      name: "capital-clicker-settings",
      partialize: (state) => ({
        language: state.language,
        soundEnabled: state.soundEnabled,
      }),
    },
  ),
);

export default useSettingsStore;
