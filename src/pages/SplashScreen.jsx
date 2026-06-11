// src/pages/SplashScreen.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFullscreen } from "@/hooks/useFullScreen";
import { isMobile } from "@/lib/platform";

export default function SplashScreen() {
  const { isFullscreen, openFullscreen } = useFullscreen();
  const [progress, setProgress] = useState(0);
  const [showButton, setShowButton] = useState(true);
  const [videoEnded, setVideoEnded] = useState(false);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  // Прогресс загрузки видео
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      if (
        video.buffered.length > 0 &&
        video.duration &&
        isFinite(video.duration)
      ) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const percent = (bufferedEnd / video.duration) * 100;
        setProgress(Math.min(100, percent));
      }
    };

    const onProgress = () => updateProgress();
    const onCanPlayThrough = () => setProgress(100);

    video.addEventListener("progress", onProgress);
    video.addEventListener("canplaythrough", onCanPlayThrough);

    return () => {
      video.removeEventListener("progress", onProgress);
      video.removeEventListener("canplaythrough", onCanPlayThrough);
    };
  }, []);

  // Редирект после окончания видео
  useEffect(() => {
    if (videoEnded) {
      const timer = setTimeout(() => {
        navigate("/home", { replace: true });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [videoEnded, navigate]);

  const handleStart = () => {
    if (!isFullscreen && isMobile()) {
      openFullscreen();
    }
    const video = videoRef.current;
    if (!video) return;

    setShowButton(false);
    video.muted = false;
    video.volume = 0.3;
    video.play().catch((err) => {
      console.error("Playback error:", err);
      setVideoEnded(true);
    });
  };

  const handleVideoEnd = () => setVideoEnded(true);

  return (
    <div
      className="min-h-[100dvh] eco-container bg-black flex flex-col py-[3.125rem] sm:py-[6.25rem]"
      // Глобальный запрет выделения и контекстного меню (для всей страницы)
      onContextMenu={(e) => e.preventDefault()}
      style={{ userSelect: "none", WebkitTouchCallout: "none" }}
    >
      <h1 className="text-[3rem] sm:text-[4rem] font-extrabold text-white uppercase text-center">
        КАПИТАЛ
      </h1>
      <p className="text-[1rem] sm:text-[1.5rem] font-semibold text-white uppercase text-center">
        КЛИКЕР
      </p>

      <div className="flex-1 flex items-center justify-between">
        <div
          onClick={handleStart}
          className="relative aspect-square rounded-full overflow-hidden h-full w-full mx-auto mb-[10vh]
          w-[35vh] max-h-[30rem] max-w-[30rem]"
          // Запрещаем контекстное меню и перетаскивание для всей области клика
          onContextMenu={(e) => e.preventDefault()}
          draggable={false}
        >
          {/* Постер */}
          <img
            src="/images/webp/splash-poster.webp"
            alt="Video poster"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            className="absolute inset-0 w-full h-full object-cover scale-120"
          />

          {/* Видео */}
          <video
            ref={videoRef}
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            src="/videos/splash-intro.mp4"
            className="absolute inset-0 w-full h-full object-cover"
            muted
            playsInline
            onEnded={handleVideoEnd}
            preload="auto"
          />

          {/* Кнопка "Начать" */}
          {showButton && (
            <button
              onClick={handleStart}
              onContextMenu={(e) => e.preventDefault()}
              className={`absolute bottom-0 left-1/2 -translate-x-1/2 px-6 py-2 bg-white/10 text-white text-lg rounded-full hover:bg-white/25 active:scale-95 transition-all z-10 whitespace-nowrap ${
                progress >= 100 ? "bg-white/20" : ""
              }`}
            >
              Начать
            </button>
          )}
        </div>
      </div>

      {/* Прогресс-бар */}
      <div className="w-full max-w-[6.25rem] sm:max-w-[25rem] mx-auto">
        <div className="w-full h-1 sm:h-2 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-200 ease-out"
            style={{ width: `${Math.floor(progress)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
