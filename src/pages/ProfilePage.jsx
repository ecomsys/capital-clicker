// src/pages/ProfilePage.jsx
import { useNavigate } from "react-router-dom";
import { AdBanner } from "@/components/basic/adBanner";
import { CountrySelect } from "@/components/profile/CountrySelect";
import { StatisticCard } from "@/components/profile/StatisticCard";
import { BackTitle } from "@/components/basic/backTitle";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";
import useSettingsStore from "@/stores/useSettingsStore";
import { accountServices } from "@/services/AccountServices";
import { adBanner } from "@/constants/honeyPot.site.js";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { soundEnabled, setSoundEnabled, language, setLanguage } = useSettingsStore();

  return (
    // Главный контейнер – flex-колонка на всю высоту
    <div className="min-h-[100dvh] min-h-screen flex flex-col pt-2 sm:pt-4 lg:pt-7.5 pb-28 lg:pb-38">
      <AdBanner
        href={adBanner.href}
        title={adBanner.title}
        imageSrc={adBanner.imageSrc}
        className="mb-2 sm:mb-4 lg:mb-5"
      />

      <BackTitle title="Профиль" onBack={() => navigate(-1)} className="mt-6" />

      {/* Центрированный контент, который занимает всё свободное пространство */}
      <div className="w-full max-w-[46.625rem] mx-auto flex flex-col flex-1">
        <div className="flex flex-col gap-3 sm:gap-5">
          {/* Статистика */}
          <div className="mt-6">
            <h2 className="text-[1.5rem] sm:text-[2rem] lg:text-[2.5rem] font-semibold mb-3 sm:mb-4 text-center">
              Статистика
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              <StatisticCard label="Кликов" value={352000} />
              <StatisticCard label="Заработано" value={352000} />
              <StatisticCard
                label="Выиграно призов"
                value={10}
                className="col-span-2 sm:col-span-1"
              />
            </div>
          </div>

          {/* Настройки */}
          <div className="mt-6">
            <h2 className="text-[1.5rem] sm:text-[2rem] lg:text-[2.5rem] font-semibold mb-3 sm:mb-4 text-center">
              Настройки
            </h2>

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <svg className="w-[1.5rem] h-[1.5rem] sm:w-[2rem] sm:h-[2rem]">
                  <use href="/icons/sprite/sprite.svg#lang" />
                </svg>
                <span className="text-[1rem] sm:text-[1.25rem] font-medium">Язык</span>
              </div>
              <CountrySelect value={language} onChange={setLanguage} />
            </div>

            <div className="flex items-center justify-between gap-3 mt-5">
              <div className="flex items-center gap-3">
                <svg className="w-[1.5rem] h-[1.5rem] sm:w-[2rem] sm:h-[2rem]">
                  <use href="/icons/sprite/sprite.svg#sound" />
                </svg>
                <span className="text-[1rem] sm:text-[1.25rem] font-medium">Звук</span>
              </div>
              <Switch
                className="h-[1.625rem] w-[3.125rem] lg:h-[2rem] lg:w-[3.4375rem]"
                checked={soundEnabled}
                onCheckedChange={setSoundEnabled}
              />
            </div>

            <Button
              onClick={() => alert("Получить вознаграждение")}
              className="mt-6 sm:mt-9 mx-auto w-full rounded-[1.125rem] px-3 h-[3.25rem] bg-golden hover:bg-golden/80 active:scale-95"
            >
              <span className="text-[1.0625rem]">Получить вознаграждение</span>
            </Button>
          </div>
        </div>

        {/* Блок с удалением и поддержкой – прижимается к низу через mt-auto */}
        <div className="mt-auto pt-2 pb-5 sm:pb-10 flex flex-col items-center justify-center gap-4">
          <button
            className="cursor-pointer text-[#ff3f3f] hover:text-[#ff3f3f]/80 transition text-base text-center"
            onClick={() => accountServices.deleteAccount()}
          >
            Удалить аккаунт
          </button>

          <Button
            onClick={() => navigate("/chat")}
            className="w-full rounded-[1.125rem] px-3 h-[3.25rem] text-golden border-golden bg-transparent hover:bg-golden/10 active:scale-95"
          >
            <span className="text-[1.0625rem]">Поддержка</span>
          </Button>
        </div>
      </div>
    </div>
  );
}