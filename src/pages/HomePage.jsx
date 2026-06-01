// src/pages/HomePage.jsx
import { useState, useRef, useCallback } from "react";
import HomeHeader from "@/components/home/Header";
import ClickCounter from "@/components/home/ClickCounter";
import EnergyDisplay from "@/components/home/EnergyDisplay";
import InstallAppButton from "@/components/home/InstallAppButton";
import ClickBear from "@/components/home/ClickBear";
import { AdBanner } from "@/components/basic/adBanner";
import { useFlyingPlus } from "@/hooks/useFlyingPlus";

export default function HomePage({
  adBanner = { href: "https://example.com", imageSrc: null, title: "РЕКЛАМА" },
}) {
  const [clicks, setClicks] = useState(0);
  const [energy, setEnergy] = useState(1000);
  const counterRef = useRef(null);
  const { flyFromClick } = useFlyingPlus();

  // Прогресс от 0 до 100 (каждый клик = +1%)
  const percent = Math.min(clicks, 100);

  const handleClickBear = useCallback(
    (event) => {
      if (energy <= 0) return;
      event.stopPropagation();
      flyFromClick(event, counterRef);
      setClicks((prev) => prev + 1);
      setEnergy((prev) => prev - 1);
    },
    [energy, flyFromClick],
  );

  const handleInstall = () =>
    alert("PWA установка – здесь будет логика beforeinstallprompt");

  return (
    <div className="min-h-screen flex flex-col pt-2 sm:pt-4 lg:pt-7.5 pb-55 xs:pb-60 sm:pb-60 lg:pb-78">
      <AdBanner {...adBanner} className="mb-2 sm:mb-4 lg:mb-5" />
      
      <HomeHeader />

      <div className="grid grid-cols-3 items-center mt-6 sm:mt-8">
        <div className="justify-self-start">
          <InstallAppButton onInstall={handleInstall} />
        </div>
        <div ref={counterRef} className="justify-self-center">
          <ClickCounter clicks={clicks} />
        </div>
        <div className="justify-self-end invisible">
          <div className="w-20 h-8" />
        </div>
      </div>

      {/* Передаём процент в ClickBear */}
      <div className="flex justify-center mt-1 sm:mt-6 lg:mt-2 mb-8 lg:mb-4  flex-1 items-center">
        <ClickBear onClick={handleClickBear} percent={percent} prize="12P" />
      </div>
      <div className="flex justify-center mb-3 lg:mb-0">
        <EnergyDisplay energy={energy} iconClasses="w-8 h-8 sm:w-8 sm:h-8" textClasses="text-[1.5rem] sm:text-[1.5rem]"/>
      </div>
    </div>
  );
}
