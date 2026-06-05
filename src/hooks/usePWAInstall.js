import { useEffect, useState } from "react";

export function usePWAInstall() {
  const [promptEvent, setPromptEvent] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const checkInstalled = () => {
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone === true;

      setIsInstalled(isStandalone);
    };

    checkInstalled();

    const handler = (e) => {
      e.preventDefault();
      setPromptEvent(e);
      setIsInstallable(true);
    };

    const installedHandler = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setPromptEvent(null);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", installedHandler);

    //  ВАЖНО: пересчитываем состояние при каждом фокусе вкладки
    window.addEventListener("focus", checkInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
      window.removeEventListener("focus", checkInstalled);
    };
  }, []);

  const install = async () => {
    if (!promptEvent) return;

    promptEvent.prompt();

    const choice = await promptEvent.userChoice;

    if (choice?.outcome === "accepted") {
      setIsInstalled(true);
    }

    setPromptEvent(null);
    setIsInstallable(false);
  };

  return {
    isInstallable,
    isInstalled,
    install,
  };
}