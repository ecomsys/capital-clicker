// src/components/prize/SuperPrizeBanner.jsx
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function SuperPrizeBanner({ prize, className = "" }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/prize-selection")}
      className={cn(
        "bg-golden flex items-center justify-center relative w-full h-[3.875rem] rounded-[1rem] overflow-hidden cursor-pointer",
        "hover:brightness-105 active:scale-[0.99] transition-all",
        className,
      )}
    >
      {/* Фоновое изображение через img с object-cover */}
      <img
        src="/images/webp/super-prize-bg.webp"
        alt=""
        className="absolute inset-0 w-full h-full object-fill pointer-events-none"
      />

      {/* Изображение слева */}
      <div className="absolute top-0 bottom-0 left-0 z-10">
        <img
          src={prize?.icon}
          alt={prize?.title}
          className="h-full w-auto object-contain"
        />
      </div>

      {/* Заголовок + описание */}
      <div className="relative z-10 inline-flex flex-col text-white">
        <span className="font-extrabold text-[0.75rem] text-white/50 uppercase leading-[1.4]">
          Главный приз
        </span>
        <span className="text-[1rem] font-bold text-white/90 leading-[1.4]">
          {prize?.title}
        </span>
      </div>
    </div>
  );
}