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
    <div className="eco-container h-screen h-[100dvh] flex flex-col overflow-hidden pt-2 sm:pt-4 lg:pt-7.5">
      {/* Реклама */}
      <AdBanner
        href={adBanner.href}
        title={adBanner.title}
        imageSrc={adBanner.imageSrc}
        className="flex-shrink-0 mb-2 sm:mb-4 lg:mb-5"
      />

      {/* Заголовок и кнопка назад */}
      <BackTitle
        title="Магазин"
        onBack={() => navigate(-1)}
        className="flex-shrink-0 mt-6 mb-5"
      />

      {/* Сетка карточек */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none w-full mx-auto pt-4 pb-16">
        {/* Мобилка: 2 колонки */}
        <div className="grid grid-cols-2 gap-3 sm:hidden max-w-[23rem] mx-auto">
          {shopCardsData.map((card) => (
            <ShopCard key={card.id} data={card} onClick={card.onClick} />
          ))}
        </div>

        {/* Планшет: 3+2 с центрированием */}
        <div className="hidden sm:grid lg:hidden gap-4 max-w-[34rem] mx-auto">
          {/* Первая строка - 3 карточки */}
          <div className="grid grid-cols-3 gap-4">
            {shopCardsData.slice(0, 3).map((card) => (
              <ShopCard key={card.id} data={card} onClick={card.onClick} />
            ))}
          </div>
          {/* Вторая строка - 2 карточки по центру */}
          <div className="grid grid-cols-2 gap-4 max-w-[66%] mx-auto">
            {shopCardsData.slice(3, 5).map((card) => (
              <ShopCard key={card.id} data={card} onClick={card.onClick} />
            ))}
          </div>
          {/* Остальные карточки (если больше 5) - по 2 в ряд */}
          {shopCardsData.length > 5 && (
            <div className="grid grid-cols-2 gap-4">
              {shopCardsData.slice(5).map((card) => (
                <ShopCard key={card.id} data={card} onClick={card.onClick} />
              ))}
            </div>
          )}
        </div>

        {/* Десктоп: 5 в ряд */}
        <div className="hidden lg:grid grid-cols-5 gap-4 mx-auto max-w-[58rem]">
          {shopCardsData.map((card) => (
            <ShopCard key={card.id} data={card} onClick={card.onClick} />
          ))}
        </div>
      </div>

      {/* нижний буфер   */}
      <div className="flex-shrink-0 h-18 sm:h-22 lg:h-28"></div>
    </div>
  );
}