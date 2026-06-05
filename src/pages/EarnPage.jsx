// src/pages/EarnPage.jsx
import { AdBanner } from "@/components/basic/adBanner";
import { GlassMessage } from "@/components/basic/GlassMessage";
import { EarnCard } from "@/components/earn/EarnCard";
import { PromoCode } from "@/components/earn/PromoCode";
import { earnCardsData } from "@/components/earn/EarnCards.data";

// импортируем переменные рекламы и приманки пока из файла
import { adBanner, lastWinner } from "@/constants/honeyPot.site.js";

export default function EarnPage() {
  const handleApplyPromo = (code) => {
    console.log("Промокод применен:", code);
    alert(`Промокод ${code} применен!`);
  };

  return (
    <div className="flex flex-col pt-2 sm:pt-4 lg:pt-7.5 pb-38">
      {/* Теперь adBanner определён */}
      <AdBanner
        href={adBanner.href}
        title={adBanner.title}
        imageSrc={adBanner.imageSrc}
        className="mb-2 sm:mb-4 lg:mb-5"
      />
     
      <GlassMessage className="font-bold text-center">
        <span>
          <span className="text-golden">{lastWinner.name}</span> выиграл{" "}
          {lastWinner.win} <span>рублей</span>
        </span>
      </GlassMessage>

      {/* остальной код без изменений */}
      <div className="pt-10 flex flex-col w-full items-center justify-center text-center">
        <h3 className="text-2xl sm:text-[2rem] font-bold text-white max-w-[18rem] max-auto">
          <span className="text-accent">Заработайте больше бонусов</span>
        </h3>
        <p className="pt-3 pb-6 text-sm sm:text-base text-[#666] max-w-[16.4375rem]">
          <span className="text-golden">Условие подписки:</span>
          <br />
          <span>Для получения вознаграждения - подписка на 1 год</span>
        </p>
      </div>

      <PromoCode
        onApply={handleApplyPromo}
        placeholder="Введите промокод"
        className="max-w-[46.625rem] mx-auto mb-4"
      />

      <div className="w-full max-w-232.5 mx-auto grid grid-cols-2 iphone:flex flex-wrap gap-3 sm:gap-4 justify-center">
        {earnCardsData.map((card) => (
          <EarnCard key={card.id} data={card} onClick={card.onClick} />
        ))}
      </div>
    </div>
  );
}