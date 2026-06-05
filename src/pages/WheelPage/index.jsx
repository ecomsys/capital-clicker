// src/pages/WheelPage

import { cn } from "@/lib/utils";
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

// запасная константа если осноовной json отвалится
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
      <div className="min-h-[100dvh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FFD700]/30 border-t-[#FFD700] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/70">Загружаем рулетку...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-[100dvh] flex flex-col pb-28 lg:pb-38">
      <header className="flex-shrink-0 pt-3 sm:pt-4 lg:pt-6 px-3">
        <AdBanner {...adBanner} className="mb-2 sm:mb-3" />
        <GlassMessage className="font-bold text-center text-sm sm:text-base flex items-center gap-1">
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
      <section className=" flex-1 w-full flex items-center justify-center">
        <Wheel
          className={cn(
            "w-full relative flex flex-col items-center overflow-visible",
            "cursor-pointer transition-transform active:scale-95",
            "min-w-[14rem] max-w-[80vw]",            
            "iphone:max-w-[90vw]",
            "sm:min-w-[24rem] sm:max-w-[40vh]",
            "lg:max-w-[50vh]",
            "xl:max-w-[52vh]",
          )}
          {...wheelProps}
        />
      </section>
    </main>
  );
}
