// src/components/home/ActionCard.jsx
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function ActionCard({
  to,
  icon,
  label,
  className,
  onClick,
  ...props
}) {
  const baseClasses = cn(
    "flex flex-col items-center justify-center rounded-[1rem] w-full",
    "bg-[#202020] shadow-[0_0_0.4375rem_0_rgba(254,141,0,0.1)] transition-all duration-200",
    "hover:bg-[#202025] hover:shadow-[0_0_0.75rem_0_rgba(254,141,0,0.2)] active:scale-95",
    "border-t border-l border-golden text-golden",
    className,
  );

  if (to) {
    return (
      <Link onClick={onClick} to={to} className={baseClasses} {...props}>
        <svg className="w-8 h-8 sm:w-10 sm:h-10 mb-1" aria-hidden="true">
          <use href={`/icons/sprite/sprite.svg#${icon}`} />
        </svg>
        <span className="text-xs sm:text-sm font-medium">{label}</span>
      </Link>
    );
  }
  return (
    <div
      onClick={onClick}
      className={cn(baseClasses, "cursor-pointer")}
      {...props}
    >
      <svg className="w-8 h-8 sm:w-10 sm:h-10 mb-1" aria-hidden="true">
        <use href={`/icons/sprite/sprite.svg#${icon}`} />
      </svg>
      <span className="text-xs sm:text-sm font-medium">{label}</span>
    </div>
  );
}
