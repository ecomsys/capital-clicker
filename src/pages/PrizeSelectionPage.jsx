// src/pages/PrizeSelectionPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { AdBanner } from "@/components/basic/adBanner";
import { BackTitle } from "@/components/basic/BackTitle";
import {
  PrizesTitle,
  PrizeCard,
  PrizeCardFullWidth,
} from "@/components/prize/PrizesUi";

import usePrizeStore from "@/stores/usePrizeStore";

export default function PrizeSelectionPage() {
  const navigate = useNavigate();
  const { setSelectedPrize } = usePrizeStore();
  const [prizes, setPrizes] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/prizes.json")
      .then((res) => res.json())
      .then((data) => {
        setPrizes(data.prizes);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка загрузки призов:", err);
        setLoading(false);
      });
  }, []);

  const handleSelectPrize = (prize) => {
    if (prize.locked) return;
    setSelectedPrize(prize);
    navigate("/super-game", { state: { prize } });
  };

  if (loading || !prizes) {
    return (
      <div className="eco-container flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-golden-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const regularMoney = prizes.money.filter((p) => !p.fullWidth);
  const fullWidthMoney = prizes.money.filter((p) => p.fullWidth);
  const fullWidthCert = prizes.certificates.filter((p) => p.fullWidth);

  return (
    <div className="flex flex-col pt-2 sm:pt-4 lg:pt-7.5 pb-35 sm:pb-40 lg:pb-50">
      <AdBanner
        href="https://example.com"
        className="bg-white/5 hover:bg-white/10 transition-all rounded-[0.5rem] h-[3.125rem] sm:h-[4.375rem] mb-2 sm:mb-4 lg:mb-5"
      >
        <div className="relative w-full h-full">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[1.25rem] uppercase text-white/30">РЕКЛАМА</span>
          </div>
        </div>
      </AdBanner>

      <BackTitle
        title="Призы"
        onBack={() => navigate("/home")}
        className="mt-6 mb-4"
        titleClassName="text-[1.25rem] sm:text-[1.5rem] lg:text-[2rem] mb-2"
      />

      <div className="w-full max-w-[46.625rem] mx-auto">
        
        {/*  Секция: Деньги */}
        <PrizesTitle>Деньги</PrizesTitle>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
          {regularMoney.map((prize) => (
            <PrizeCard
              key={prize.id}
              prize={prize}
              textClasses="font-sanscond text-[1.5rem] leading-[1]"
              onSelect={() => handleSelectPrize(prize)}
            />
          ))}
        </div>

        {/* Баннер на всю ширину (деньги) */}
        {fullWidthMoney.map((prize) => (
          <div key={prize.id} className="mb-4">
            <PrizeCardFullWidth
              prize={prize}
              onSelect={() => handleSelectPrize(prize)}
            />
          </div>
        ))}

        {/* Секция: Предметы */}
        <PrizesTitle>Предметы</PrizesTitle>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {prizes.gifts.map((prize) => (
            <PrizeCard
              key={prize.id}
              prize={prize}
              textClasses="text-[1rem] sm:text-[1rem] leading-[1]"
              onSelect={() => handleSelectPrize(prize)}
            />
          ))}
        </div>

        {/* Секция: Сертификаты (2 в ряд) */}
        <PrizesTitle>Сертификаты</PrizesTitle>
        <div className="grid grid-cols-2 gap-5 mb-4">
          {prizes.certificates
            .filter((c) => !c.fullWidth)
            .map((cert) => (
              <PrizeCard
                key={cert.id}
                prize={cert}
                textClasses="font-sanscond sm:font-sans text-[1.5rem] sm:text-[2rem] leading-[1]"
                layout="wide"
                onSelect={() => handleSelectPrize(cert)}
              />
            ))}
        </div>

        {/* Сертификат на всю ширину */}
        {fullWidthCert.map((cert) => (
          <div key={cert.id} className="mb-4">
            <PrizeCardFullWidth
              prize={cert}
              onSelect={() => handleSelectPrize(cert)}
            />
          </div>
        ))}

      </div>
    </div>
  );
}