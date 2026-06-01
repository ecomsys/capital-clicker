// src/hooks/useFullscreen.js
import { useState, useEffect, useCallback } from "react";

export function useFullscreen(mobileOnly = true) {
  const [isFullscreen, setIsFullscreen] = useState(
    Boolean(document.fullscreenElement)
  );

  useEffect(() => {
    const handler = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const openFullscreen = useCallback(() => {

    const el = document.documentElement;
    const requestMethod =
      el.requestFullscreen ||
      el.webkitRequestFullscreen ||
      el.mozRequestFullScreen ||
      el.msRequestFullscreen;
    if (requestMethod) {
      requestMethod.call(el).catch(console.error);
    }
  }, [mobileOnly]);

  const closeFullscreen = useCallback(() => {
    const exitMethod =
      document.exitFullscreen ||
      document.webkitExitFullscreen ||
      document.mozCancelFullScreen ||
      document.msExitFullscreen;
    if (exitMethod) {
      exitMethod.call(document).catch(console.error);
    }
  }, []);

  return { isFullscreen, openFullscreen, closeFullscreen };
}