// src/components/basic/BottomNavbar.jsx
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useFullscreen } from "@/hooks/useFullscreen"; 
import { isMobile } from "@/lib/platform";


export default function BottomNavbar() {
  const location = useLocation();
   const { isFullscreen, openFullscreen } = useFullscreen();

  const navItems = [
    { to: "/home", icon: "home", label: "Главная" },
    { to: "/mini-game", icon: "game", label: "Мини-Игра" },
    { to: "/friends", icon: "friends", label: "Друзья" },
    { to: "/earn", icon: "earn", label: "Заработать" },
    { to: "/clans", icon: "clan", label: "Кланы" },
  ];

    // Базовые классы навбара — вынес для чистоты
  const navbarClasses = cn(
    "mx-auto flex items-center justify-between min-w-[18rem]",
    "bg-navbar border border-gray-50/20",
    "w-full rounded-[1.5rem]",
    "h-[4.3125rem] lg:h-[6.625rem]",
    "max-w-[46.625rem]"
  );

    const handleLinkClick = () => {
    // Вызываем полный экран только если мы еще не в нем, 
    // чтобы избежать лишних вызовов API
    if (!isFullscreen && isMobile()) {
      // openFullscreen();
    }
  };

  return (
    <nav className={navbarClasses}
      role="navigation"
      aria-label="Основная навигация"
    >
     
      {navItems.map((item) => {
        const isActive = location.pathname === item.to;

        return (
          <NavLink
            key={item.to}
            to={item.to}
             onClick={handleLinkClick}
            className={`flex-1 flex flex-col items-center justify-center gap-1 lg:gap-1.5 py-2 transition-all duration-200
            ${isActive ? "text-golden" : "text-navbarlink hover:text-gray-200"}`}
            aria-current={isActive ? "page" : undefined}
          >
            <svg
              className={`
                    w-5 h-5 lg:w-7 lg:h-7 flex-shrink-0
                    transition-all duration-200
                    ${isActive ? "scale-110 text-golden" : "text-current"}
                  `}
              aria-hidden="true"
            >
              <use href={`/icons/sprite/sprite.svg#${item.icon}`} />
            </svg>

            <span
              className={`
                    text-[0.625rem] lg:text-[0.875rem] font-medium 
                    leading-tight text-center
                    truncate w-full px-1
                  `}
            >
              {item.label}
            </span>
          </NavLink>
        );
      })}
    </nav>
  );
}
