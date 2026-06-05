import { usePWAInstall } from "@/hooks/usePWAInstall";
import useModalStore from "@/stores/useModalStore";
import { isIOS } from "@/lib/platform";

export default function InstallAppButton() {
  const { isInstallable, install, isInstalled } = usePWAInstall();

  const { openModal } = useModalStore();

  const handleClick = async () => {
    if (isInstalled) return;

    //  iOS fallback
    if (isIOS()) {
      openModal({
        classes: "sm:max-w-4xl",
        content: (
          <div className="px-4 sm:px-10 space-y-2 text-white font-light">
            <div className="pt-7 text-center">
              <h3 className="text-xl font-bold mb-3">Установить приложение</h3>
            </div>

            <p className="text-center">
              Нажмите «Поделиться» в Safari → «На экран «Домой».
            </p>

            <div className="pt-5 pb-10 text-center">
              <img
                src="/images/webp/ios-guide.webp"
                alt="Инструкция"
                className="w-full rounded-lg border border-golden"
              />
            </div>
          </div>
        ),
      });

      return;
    }

    //  install flow
    if (isInstallable) {
      await install();
      return;
    }

    //  fallback
    openModal({
      classes: "sm:max-w-xl",
      content: (
        <div className="px-4 sm:px-10 space-y-2 text-white font-light text-center pb-8">
          <div className="pt-7">
            <h3 className="text-xl font-bold mb-3">Установка недоступна </h3>
          </div>
          <p className="text-red-400 text-lg">Возможные причины:</p>
          <p className="text-red-400 text-lg">
            1. Откройте сайт через HTTPS или используйте поддерживаемый браузер.
          </p>
          <p className="text-red-400 text-lg">2. Приложение уже установлено.</p>
        </div>
      ),
    });
  };

  const buttonClasses = isInstalled
    ? "flex items-center flex-col sm:flex-row bg-green-600 text-white font-bold rounded-[1rem] px-4 py-2 gap-0.5 sm:gap-3"
    : "flex items-center flex-col sm:flex-row bg-[linear-gradient(147deg,#ffd901_0%,#ff8801_100%)] text-[#0f0f0f] font-bold rounded-[1rem] px-4 py-2 gap-0.5 sm:gap-3 transition-all hover:scale-[1.02] active:scale-95";

  return (
    <button
      onClick={handleClick}
      className={buttonClasses}
      disabled={isInstalled}
    >
      {isInstalled ? (
        <>
          <svg className="text-white w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true">
            <use href={`/icons/sprite/sprite.svg#info`} />
          </svg>
          <div className="flex flex-col text-center sm:text-left">
            <span className="text-[0.6rem] uppercase">приложение</span>
            <span className="text-[0.75rem] font-bold uppercase">
              установлено
            </span>
          </div>
        </>
      ) : (
        <>
          <img
            className="w-5 h-5 sm:w-6 sm:h-6"
            src="./images/webp/icons-png/play-market.webp"
            alt="Install"
          />
          <div className="flex flex-col text-center sm:text-left">
            <span className="text-[0.6rem] uppercase">установить</span>
            <span className="text-[0.75rem] font-bold uppercase">
              приложение
            </span>
          </div>
        </>
      )}
    </button>
  );
}
