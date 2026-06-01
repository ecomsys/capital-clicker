// src/services/AccountService.jsx
import useModalStore from "@/stores/useModalStore";
import { Button } from "@/components/ui/Button";

class AccountServices {

  // удаление аккаунта
  deleteAccount() {
    const { openModal } = useModalStore.getState();

    openModal({
      classes: "w-full sm:max-w-[33.75rem]",
      content: (
        <div className="py-10 sm:py-8 px-4 sm:px-8 space-y-2 text-white font-light">
          {/* Заголовок */}
          <div className="pb-1 text-center">
            <span className="text-xl sm:text-2xl font-semibold">
              Удалить аккаунт?
            </span>
          </div>

          {/* Описание */}
          <div className="text-center max-w-117.5 mx-auto">
            <span className="text-white/16 text-[0.875rem] sm:text-[1rem] leading-[1.5] text-center ">
              Ваш аккаунт будет удален через 30 дней. Все данные будут
              безвозвратно удалены. Это действие нельзя отменить.
            </span>
          </div>

          <div className="pt-4 flex flex-col gap-3">
            {/* Кнопка покупки */}
            <Button
              onClick={() => {
                this.confirmDelete();
                useModalStore.getState().closeModal();
              }}
              className="max-w-[46.625rem] w-full rounded-[1.125rem] px-3 h-[3.25rem] bg-golden hover:bg-golden/80 active:scale-95 transition-all"
            >
              <span className="text-[1.0625rem]">Удалить</span>
            </Button>

            <Button
              onClick={() => useModalStore.getState().closeModal()}
              className="max-w-[46.625rem] w-full rounded-[1.125rem] px-3 h-[3.25rem] bg-white/5 hover:bg-white/10 active:scale-95 transition-all"
            >
              <span className="text-[1.0625rem]">Отмена</span>
            </Button>
          </div>
        </div>
      ),
    });
  }

  // удаление аккаунта - вспомогоательный метод
  confirmDelete() {
    console.log("Аккаунт удален");
    // Очищаем localStorage
    localStorage.clear();
    // Очищаем все сторы
    useModalStore.getState().closeModal();
    // Редирект на главную
    window.location.href = "/";
  }
}

export const accountServices = new AccountServices();
