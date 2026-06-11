// src/components/home/ClickCounter.jsx

import { cn } from "@/lib/utils";
import {clsx} from "clsx";
import {isMobile} from "react-device-detect";

export default function ClickCounter({ clicks, className, icon = "/images/webp/icons-png/click-finger.webp" }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 sm:gap-3 relative z-10",
        "px-4",
        "text-white",
        className
      )}
    >
      <img
        src={icon}
        alt="Клик"
        className={clsx(isMobile && "mr-2", "w-8 h-8 sm:w-10 sm:h-10 object-contain")}
      />
      <span className="text-[1.875rem] sm:text-[2.5rem] font-bold">
        {clicks.toLocaleString()}
      </span>
    </div>
  );
}
