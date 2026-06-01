// src/components/home/TreasureChest.jsx
import { cn } from "@/lib/utils";
import { useRef } from "react";

export default function TreasureChest({
  progress = 90, // 0..100, статичный
  onCollect,
  chestUrl = "/images/webp/icons-png/sunduk.webp",
  className,
  ...props
}) {
  const cardRef = useRef(null);
  const canCollect = progress >= 100;

  const handleClick = () => {
    if (canCollect) {
      onCollect?.();
    }
  };

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      className={cn(
        "relative flex flex-col items-center justify-center border-2 border-white/10",
        "bg-[#202020] rounded-[0.9rem] w-full",
        "transition-all duration-200",
        canCollect ? "cursor-pointer hover:bg-[#202025] active:scale-95" : "cursor-not-allowed",
        className
      )}
      {...props}
    >
     

      {/* 🎁 Сундук по центру */}
      <div className="relative z-10 w-16 h-16 sm:w-16 sm:h-16 flex items-center justify-center">
        <img
          src={chestUrl}
          alt="Сундук"
          className="w-full h-full object-contain p-1"
        />
      </div>
    </div>
  );
}