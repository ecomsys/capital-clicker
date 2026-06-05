// src/pages/MiniGamePage.jsx

import { AdBanner } from "@/components/basic/adBanner";
import { GlassMessage } from "@/components/basic/GlassMessage";

// импортируем переменные рекламы и приманки пока из файла
import { adBanner, lastWinner } from "@/constants/honeyPot.site.js";

export default function MiniGamePage() {
  return (
    <div className="min-h-screen flex flex-col pt-2 sm:pt-4 lg:pt-7.5 pb-20 sm:pb-40 lg:pb-50">
      <AdBanner
        href={adBanner.href}
        title={adBanner.title}
        imageSrc={adBanner.imageSrc}
        className="mb-2 sm:mb-4 lg:mb-5 "
      />

      <GlassMessage className="font-bold text-center">
        <span>
          <span className="text-golden">{lastWinner.name}</span> выиграл{" "}
          {lastWinner.win} <span>рублей</span>
        </span>
      </GlassMessage>

      <div className="mt-3 sm:mt-8 flex-1 flex items-center justify-center">
        <h1 className="text-xl sm:text-3xl uppercase textt-center"> Здесь будет мини-игра.</h1>
      </div>
    </div>
  );
}
