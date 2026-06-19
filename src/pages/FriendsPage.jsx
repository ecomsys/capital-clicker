// src/pages/FriendsPage.jsx

import { AdBanner } from "@/components/basic/adBanner";
import { GlassMessage } from "@/components/basic/GlassMessage";
import EmptyFriendsState from "@/components/friends/EmptyFriendsState";
import { Button } from "@/components/ui/Button";

// импортируем переменные рекламы и приманки пока из файла
import { adBanner, lastWinner } from "@/constants/honeyPot.site.js";

export default function FriendsPage() {

  return (
    // add min-h-[inherit] for centering vertical
    <div className="eco-container h-screen h-[100dvh] flex flex-col pt-2 sm:pt-4 lg:pt-7.5">
      <AdBanner
        href={adBanner.href}
        title={adBanner.title}
        imageSrc={adBanner.imageSrc}
        className="flex-shrink-0 mb-2 sm:mb-4 lg:mb-5 "
      />

      <GlassMessage className="flex-shrink-0 font-bold text-center">
        <span>
          <span className="text-orange">{lastWinner.name}</span> выиграл{" "}
          {lastWinner.win} <span>рублей</span>
        </span>
      </GlassMessage>

      <EmptyFriendsState className="flex-1 flex flex-col" />

      <div className="flex-shrink-0 min-w-[18rem] mt-auto pb-5 sm:pb-10 flex justify-center">
        <Button className="max-w-[46.625rem] w-full rounded-[1.125rem] px-3 h-[3.25rem] bg-golden hover:bg-golden/80 active:scale-95">
          <span className="text-[1.0625rem]">Пригласить друга</span>
        </Button>
      </div>

      {/* нижний буфер   */}
      <div className="flex-shrink-0 h-21 sm:h-23 lg:h-30"></div>
    </div>
  );
}
