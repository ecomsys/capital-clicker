// src/pages/FriendsPage.jsx
import { useState } from "react";
import { AdBanner } from "@/components/basic/adBanner";
import { GlassMessage } from "@/components/basic/GlassMessage";
import EmptyFriendsState from "@/components/friends/EmptyFriendsState";
import { Button } from "@/components/ui/Button";

// импортируем переменные рекламы и приманки пока из файла
import { adBanner, lastWinner } from "@/constants/honeyPot.site.js";

export default function FriendsPage() {
  // Временное состояние для демонстрации
  // Позже заменишь на реальные данные из store/API
  const [friendsList] = useState([]); // [] - пусто, показываем заглушку
  // const [friendsList] = useState([{ id: 1, name: "Алексей", avatar: null }]); // есть друзья

  const hasFriends = friendsList.length > 0;

  return (
    // add min-h-[inherit] for centering vertical
    <div className="min-h-screen flex flex-col pt-2 sm:pt-4 lg:pt-7.5 pb-28 lg:pb-38">
      <AdBanner
        href={adBanner.href}
        title={adBanner.title}
        imageSrc={adBanner.imageSrc}
        className="mb-2 sm:mb-4 lg:mb-5 "
      />

      <GlassMessage className="font-bold text-center">
        <span>
          <span className="text-orange">{lastWinner.name}</span> выиграл{" "}
          {lastWinner.win} <span>рублей</span>
        </span>
      </GlassMessage>

      {/* Логика отображения */}
      {hasFriends ? (
        <div className="mt-6">
          <h2 className="text-lg font-bold mb-4">
            Мои друзья ({friendsList.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {friendsList.map((friend) => (
              <div
                key={friend.id}
                className="flex items-center gap-3 bg-white/5 rounded-xl p-3"
              >
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  {friend.avatar ? (
                    <img
                      src={friend.avatar}
                      alt={friend.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white/60 text-lg">👤</span>
                  )}
                </div>
                <span className="font-medium">{friend.name}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="mt-8 flex-1 flex items-center justify-center">
            <EmptyFriendsState />
          </div>
          <div className="min-w-[18rem] mt-auto pb-5 sm:pb-10 flex justify-center">
            <Button className="max-w-[46.625rem] w-full rounded-[1.125rem] px-3 h-[3.25rem] bg-golden hover:bg-golden/80 active:scale-95">
              <span className="text-[1.0625rem]">Пригласить друга</span>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
