import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

export const GlassButton = forwardRef(
  (
    {
      as: Component = "button",
      href,
      onClick,
      children,
      icon,
      iconClassName = "",
      className = "",
      ...props
    },
    ref,
  ) => {
    const baseStyles = cn(
      "rounded-[1.125rem] px-3 h-[3.25rem] sm:h-[3.75rem]",
      "inline-flex items-center justify-center gap-3 bg-white/5",
      "text-white font-medium",
      "transition-all duration-200",
      "hover:bg-white/10 active:scale-95",
      "focus:outline-none",
      className
    );

    const iconStyles = cn(
      "w-6 h-6 lg:w-8 lg:h-8 flex-shrink-0 transition-transform duration-200",
      iconClassName
    );

    const content = (
      <>
        {icon && (
          <svg className={iconStyles} aria-hidden="true">
            <use href={`/icons/sprite/sprite.svg#${icon}`} />
          </svg>
        )}
        {children}
      </>
    );

    // Если есть href – используем Link с пробросом ref
    if (href) {
      return (
        <Link to={href} className={baseStyles} ref={ref} {...props}>
          {content}
        </Link>
      );
    }

    // Если передан нестандартный компонент (например, "div")
    if (Component !== "button") {
      const CustomComponent = Component;
      return (
        <CustomComponent
          className={baseStyles}
          ref={ref}
          onClick={onClick}
          {...props}
        >
          {content}
        </CustomComponent>
      );
    }

    // Обычная кнопка
    return (
      <button onClick={onClick} className={baseStyles} ref={ref} {...props}>
        {content}
      </button>
    );
  },
);

GlassButton.displayName = "GlassButton";