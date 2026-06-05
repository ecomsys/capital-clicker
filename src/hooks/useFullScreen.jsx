// src/hooks/useFullscreen.js
import { useState, useEffect, useCallback } from "react";

export function useFullscreen(mobileOnly = true) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Проверяем, мобильное ли устройство (по ширине экрана или userAgent)
  const isMobileDevice = () => {
    if (typeof window === "undefined") return false;
    return (
      /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
      window.innerWidth <= 768
    );
  };

  useEffect(() => {
    if (typeof document === "undefined") return;

    // Устанавливаем начальное состояние
    const foo = () => setIsFullscreen(Boolean(document.fullscreenElement));
    foo();

    const handler = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const openFullscreen = useCallback(async () => {
    if (typeof document === "undefined") return;

    // Если fullscreen уже активен, не делаем ничего
    if (document.fullscreenElement) return;

    // Если mobileOnly = true и это не мобильное устройство – не включаем
    if (mobileOnly && !isMobileDevice()) return;

    const el = document.documentElement;
    const requestMethod =
      el.requestFullscreen ||
      el.webkitRequestFullscreen ||
      el.mozRequestFullScreen ||
      el.msRequestFullscreen;

    if (!requestMethod) {
      console.warn("Fullscreen API не поддерживается");
      return;
    }

    try {
      await requestMethod.call(el);
    } catch (err) {
      console.warn("Fullscreen request failed:", err);
    }
  }, [mobileOnly]);

  const closeFullscreen = useCallback(async () => {
    if (typeof document === "undefined") return;

    const exitMethod =
      document.exitFullscreen ||
      document.webkitExitFullscreen ||
      document.mozCancelFullScreen ||
      document.msExitFullscreen;

    if (!exitMethod) return;

    try {
      await exitMethod.call(document);
    } catch (err) {
      console.warn("Exit fullscreen failed:", err);
    }
  }, []);

  return { isFullscreen, openFullscreen, closeFullscreen };
}
