// src/pages/ShopPage.jsx
import { useNavigate } from "react-router-dom";
import { AdBanner } from "@/components/basic/adBanner";
import { BackTitle } from "@/components/basic/BackTitle";
import { ShopCard } from "@/components/shop/ShopCard";
import { shopCardsData } from "@/components/shop/ShopCards.data";

// импортируем переменные рекламы и приманки пока из файла
import { adBanner } from "@/constants/honeyPot.site.js";

export default function ShopPage() {
  const navigate = useNavigate();

  return (
    // add min-h-[inherit] for centering vertical
    <div className="pt-2 sm:pt-4 lg:pt-7.5 pb-40 sm:pb-55 lg:pb-65">
      {/* Реклама */}
      <AdBanner
        href={adBanner.href}
        title={adBanner.title}
        imageSrc={adBanner.imageSrc}
        className="mb-2 sm:mb-4 lg:mb-5 "
      />

      {/* Заголовок и кнопка назад */}
      <BackTitle
        title="Магазин"
        onBack={() => navigate(-1)}
        className="mt-6 mb-10"
      />

      <div className="w-full max-w-232.5 mx-auto grid grid-cols-2 iphone:flex flex-wrap gap-3 sm:gap-4 justify-center">        
        {shopCardsData.map((card) => (
          <ShopCard key={card.id} data={card} onClick={card.onClick} />
        ))}
      </div>
    </div>
  );
}
