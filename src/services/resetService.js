// src/services/resetService.js
import useHomeBearStore from "@/stores/useHomeBearStore";
import useSuperBearStore from "@/stores/useSuperBearStore";
import useBalanceStore from "@/stores/useBalanceStore";
import useChestStore from "@/stores/useChestStore";
import useSuperPrizeStore from "@/stores/useSuperPrizeStore";
import useSettingsStore from "@/stores/useSettingsStore";

/**
 * Сброс всех игровых данных к начальным значениям.
 * Полезно для тестирования или кнопки "Начать заново".
 */
export const resetAllProgress = () => {
  // Сброс стора обычного медведя
  useHomeBearStore.getState().resetHomeBear();

  // Сброс стора супер-медведя
  useSuperBearStore.getState().resetSuperBear();

  // Сброс денежного баланса
  useBalanceStore.getState().resetBalance();

  // Сброс прогресса сундуков
  useChestStore.getState().resetAll?.(); 

  // Очистка выбранного супер-приза
  useSuperPrizeStore.getState().clearSelectedPrize();

  // Сброс настроек (звук, язык, режим) – если нужно
  useSettingsStore.getState().resetSettings?.(); // если такого метода нет – можно расширить

  // Дополнительно: очистка localStorage (через persist механизм сторов уже сам перезапишет, но можно и принудительно)
  // Если нужно полностью очистить всё хранилище, можно вызвать:
  localStorage.removeItem('capital-clicker-home-bear');
  localStorage.removeItem('capital-clicker-super-bear');
  localStorage.removeItem('capital-clicker-balance');
  localStorage.removeItem('capital-clicker-chest');
  localStorage.removeItem('capital-clicker-selected-prize');
  localStorage.removeItem('capital-clicker-settings');

  console.log("Все игровые данные сброшены к значениям по умолчанию");
};