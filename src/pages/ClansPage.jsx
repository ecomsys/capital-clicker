// src/pages/ClansPage.jsx
import { useState } from "react";
import { AdBanner } from "@/components/basic/adBanner";
import { GlassMessage } from "@/components/basic/GlassMessage";
import EmptyClansState from "@/components/clans/EmptyClansState";

// импортируем переменные рекламы и приманки пока из файла
import { adBanner, lastWinner } from "@/constants/honeyPot.site.js";

export default function ClansPage() {
  // Временное состояние для демонстрации
  // Позже заменишь на реальные данные из store/API
  const [clansList] = useState([]); // [] - пусто, показываем заглушку
  // const [clansList] = useState([{ id: 1, name: "Горцы", avatar: null }]); // есть кланы

  const hasClans = clansList.length > 0;

  return (
    // add min-h-[inherit] for centering vertical
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

      {/* Логика отображения */}
      {hasClans ? (
        <div className="mt-6">
          <h2 className="text-lg font-bold mb-4">
            Мои кланы ({clansList.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {clansList.map((clan) => (
              <div
                key={clan.id}
                className="flex items-center gap-3 bg-white/5 rounded-xl p-3"
              >
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  {clan.avatar ? (
                    <img
                      src={clan.avatar}
                      alt={clan.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white/60 text-lg">👤</span>
                  )}
                </div>
                <span className="font-medium">{clan.name}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-3 sm:mt-8 flex-1 flex items-center justify-center">
          <EmptyClansState />
        </div>
      )}
    </div>
  );
}
