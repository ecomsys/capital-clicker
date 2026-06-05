// src/app/Provider.jsx
import { useEffect } from "react";
import { AppRouter } from "@/app/Router";
// import { initViewport } from "@/lib/viewport";
import { initAutoRem } from "@/lib/auto-rem";
import Modal from "@/components/basic/Modal";
import useModalStore from "@/stores/useModalStore";
import { preloadSound, unlockAudio } from "@/audio/manager"; // Импортируем функцию предзагрузки

export function AppProvider() {
  const { classes } = useModalStore();

  useEffect(() => {
    const cleanupAutoRem = initAutoRem(1980, 16);
    // const cleanupViewport = initViewport(1536, 1980);

    // Предзагружаем звуки, которые часто используются в игре
    preloadSound("/sounds/click.mp3");
    preloadSound("/sounds/coin-into.mp3");
    preloadSound("/sounds/chest-collect.mp3");
    preloadSound("/sounds/super-click.mp3");
    preloadSound("/sounds/wheel-win.mp3");
    preloadSound("/sounds/wheel-rotate.mp3");
    // Добавь сюда любые другие звуки (например, для сундуков, энергии и т.д.)

    // Разблокируем звук по первому касанию (без ожидания)
    const unlockOnTouch = () => {
      unlockAudio();
      document.removeEventListener("touchstart", unlockOnTouch);
      document.removeEventListener("click", unlockOnTouch);
    };
    document.addEventListener("touchstart", unlockOnTouch);
    document.addEventListener("click", unlockOnTouch);

    return () => {
      cleanupAutoRem();
      // cleanupViewport();
      document.removeEventListener("touchstart", unlockOnTouch);
      document.removeEventListener("click", unlockOnTouch);
    };
  }, []);

  return (
    <>
      <AppRouter />
      <Modal className={classes} />
    </>
  );
}

export default AppProvider;
