// src/components/ui/Switch.jsx
import { cn } from "@/lib/utils";

export function Switch({ checked = false, onCheckedChange, disabled = false, className }) {
  const handleClick = () => {
    if (disabled) return;
    onCheckedChange?.(!checked);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        "relative inline-flex cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none",
        "bg-white/10", // фон по умолчанию (будет перекрыт при checked)
        checked && "bg-golden",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      style={{ padding: '0.0625rem' }}
    >
      <span
        className={cn(
          "pointer-events-none block rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out",
          "h-full aspect-square",
          checked ? "translate-x-[100%] lg:translate-x-[80%]" : "translateX(0)"
        )}
       
      />
    </button>
  );
}