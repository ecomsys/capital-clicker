// src/components/basic/GlassMessage.jsx

import { cn } from "@/lib/utils";

export function GlassMessage({ children, className = "", ...props }) {
  return (
    <div
      className={cn(
        "w-full bg-[rgb(255,255,255,0.03)] border border-white/8 rounded-[1.125rem] px-3 h-[2.5rem] sm:h-[3.125rem] flex items-center justify-center",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
