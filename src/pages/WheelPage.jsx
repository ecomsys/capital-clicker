import { useEffect, useState, useMemo } from "react";
import { AdBanner } from "@/components/basic/adBanner";
import { GlassMessage } from "@/components/basic/GlassMessage";
import Wheel from "@/components/wheel/Wheel";

// Заглушка на случай, если данные не загрузились
const DEFAULT_PRIZES = [
  { title: "100 ₽", value: 100 },
  { title: "500 ₽", value: 500 },
  { title: "×2", value: "multiplier" },
  { title: "Авто", value: "gift" },
  { title: "1000 ₽", value: 1000 },
  { title: "Кукишь", value: "multiplier" },
  { title: "ДЖЕКПОТ", value: 5000 }  
];

export default function WheelPage({
  adBanner = { href: "https://example.com", imageSrc: null, title: "РЕКЛАМА" },
  winner = { name: "Иван", win: "1000" },
}) {
  const [prizes, setPrizes] = useState(DEFAULT_PRIZES);
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

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
        console.warn(" Загружаем дефолтные призы:", err.message);
        // prizes уже установлен в DEFAULT_PRIZES
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
      
    return () => { mounted = false; };
  }, []);

  const handleWin = (prize) => {
    console.log(" Выигрыш:", prize);
    // Здесь: зачисление, модалка, аналитика и т.д.
  };

  //  Мемоизируем, чтобы не было перерендеров при загрузке
  const wheelProps = useMemo(() => ({
    prizes,
    onWin: handleWin
  }), [prizes]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FFD700]/30 border-t-[#FFD700] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/70">Загружаем рулетку...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col pb-26+ lg:pb-40 ">
      {/* Верхняя часть — фиксированная высота, чтобы не прыгало */}
      <header className="flex-shrink-0 pt-3 sm:pt-4 lg:pt-6 px-3">
        <AdBanner {...adBanner} className="mb-2 sm:mb-3" />
        <GlassMessage className="font-bold text-center text-sm sm:text-base">
          <span className="text-[#FFD700]">{winner.name}</span> только что выиграл{" "}
          <span className="text-white">{winner.win} ₽</span>
        </GlassMessage>
      </header>

      {/*  Центральная часть */}
      <section className="flex-1 flex items-center justify-center py-1">
        <Wheel {...wheelProps} />
      </section>
     
    </main>
  );
}