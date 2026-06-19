// src/pages/WheelPage.jsx

import { useEffect, useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

// компонеты
import Wheel from "@/components/wheel/Wheel";
import { AdBanner } from "@/components/basic/adBanner";
import { BackTitle } from "@/components/basic/BackTitle";
import { GlassMessage } from "@/components/basic/GlassMessage";

// менеджер звуков
import { playSound } from "@/audio/manager";

// сторы
import useChestStore from "@/stores/useChestStore";

// запасная константа если основой json отвалится
import { DEFAULT_PRIZES } from "@/pages/WheelPage/defaultPrizes.data";

// импортируем переменные рекламы и приманки пока из файла
import { adBanner, lastWinner } from "@/constants/honeyPot.site.js";

export default function WheelPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const from = searchParams.get("from") || "main";
  const progress = useChestStore((state) => state.getProgress(from));
  const limit = useChestStore((state) => state.getLimit(from));
  const isCompleted = progress >= limit;

  const [prizes, setPrizes] = useState(DEFAULT_PRIZES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetch("/data/wheel-prizes.json")
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка загрузки");
        return res.json();
      })
      .then((data) => {
        if (mounted && data?.wheel?.length) {
          setPrizes(data.wheel);
        }
      })
      .catch((err) => {
        console.warn("Загружаем дефолтные призы:", err.message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleWin = (prize) => {
    console.log("Выигрыш:", prize);
    playSound("/sounds/wheel-win.mp3", { volume: 0.25 });
    // Здесь можно добавить логику зачисления приза, аналитику и т.д.
  };

  const handleCloseModal = () => {
    navigate(-1);
  };

  const wheelProps = useMemo(
    () => ({
      prizes,
      onWin: handleWin,
      disabled: !isCompleted,
      disabledMessage: `Соберите сундук с прогрессом до ${limit}, чтобы крутить колесо. Текущий прогресс: ${progress}/${limit}`,
      onClose: handleCloseModal,
      from,
    }),
    [prizes, isCompleted, progress, limit, handleWin, handleCloseModal],
  );

  if (loading) {
    return (
      <div className="h-screen h-[100dvh] flex items-center justify-center pt-3 sm:pt-4 lg:pt-6 px-3">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FFD700]/30 border-t-[#FFD700] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/70">Загружаем рулетку...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen h-[100dvh] eco-container flex flex-col pt-2 sm:pt-4 lg:pt-7.5 overflow-hidden">
      <header className="flex-shrink-0 ">
        <AdBanner {...adBanner} className="mb-2 sm:mb-3" />
        <GlassMessage className="font-bold text-center text-sm sm:text-base flex items-center gap-1 flex-shrink-0">
          <span className="text-[#FFD700]">{lastWinner.name}</span>
          <span>только что выиграл</span>
          <span className="text-white">{lastWinner.win} ₽</span>
        </GlassMessage>

        {/* Заголовок и кнопка назад */}
        <BackTitle
          title="Колесо фортуны"
          onBack={() => navigate(-1)}
          className="mt-6 mb-1"
        />
      </header>

      {/* Колесо занимает всё доступное место */}
      <section className="flex-1 min-h-[12rem] w-full flex items-center justify-center px-2 py-1">
        <div className="min-h-[inherit] w-full h-full max-h-[100vw] aspect-square flex items-center justify-center">
          <Wheel
            className="w-full h-full flex flex-col items-center justify-center"
            {...wheelProps}
          />
        </div>
      </section>

      {/* нижний буфер   */}
      <div className="flex-shrink-0 h-26 sm:h-25 lg:h-35"></div>
    </div>
  );
}
