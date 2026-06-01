// src/components/home/EnergyDisplay.jsx

import { cn } from "@/lib/utils";

export default function EnergyDisplay({ energy, className,iconClasses, textClasses, icon = "/images/webp/icons-png/flash.webp" }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 sm:gap-2",        
        "px-4",
        "text-white",
        className
      )}
    >
      <img 
        src={icon} 
        alt="Клик" 
        className={cn("w-6 h-6 sm:w-8 sm:h-8 object-contain", iconClasses)}
      />
      <span className={cn("text-[1rem] sm:text-[1.5rem] font-bold", textClasses)}>
        {energy.toLocaleString()}
      </span>
    </div>
  );
}