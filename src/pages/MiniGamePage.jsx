// src/pages/MiniGamePage.jsx
import { AdBanner } from "@/components/basic/adBanner";
import { GlassMessage } from "@/components/basic/GlassMessage";
import EmptyMiniState from "@/components/mini/EmptyMiniState";

// импортируем переменные рекламы и приманки пока из файла
import { adBanner, lastWinner } from "@/constants/honeyPot.site.js";

export default function MiniGamePage() {
  return (
    <div className="h-screen h-[100dvh] eco-container flex flex-col overflow-hidden pt-3 sm:pt-4 lg:pt-6">
      <AdBanner
        href={adBanner.href}
        title={adBanner.title}
        imageSrc={adBanner.imageSrc}
        className="flex-shrink-0 mb-2 sm:mb-4 lg:mb-5"
      />

      <GlassMessage className="flex-shrink-0 font-bold text-center">
        <span>
          <span className="text-golden">{lastWinner.name}</span> выиграл{" "}
          {lastWinner.win} <span>рублей</span>
        </span>
      </GlassMessage>

      {/* Картинка занимает всё доступное место и резиновая */}
      <EmptyMiniState className="flex-1 my-4" />

      {/* нижний буфер   */}
      <div className="flex-shrink-0 h-22 sm:h-25 lg:h-35"></div>
    </div>
  );
}
