// src/layouts/Layout.jsx

import { Outlet } from "react-router-dom";

// хуки
import { useLocation } from "react-router-dom";
import { useShouldShowNavbar } from "@/hooks/useShouldShowNavbar";

import OrientationGuard from "@/components/OrientationGuard";
import BottomNavbar from "@/components/basic/BottomNavbar";

import { TooltipProvider } from "@/components/ui/tooltip";

// Лейаут компонент
export default function Layout() {
  const location = useLocation();
  const showNavbar = useShouldShowNavbar();

  // сравнение локаций
  const isSplash = location.pathname === "/splash";
  // const isHome = location.pathname === "/home";

  const isFixed = true;

  return (
    <OrientationGuard className={`${isSplash ? "" : "bg-black relative"}`}>
      <main className="flex-1">
        <TooltipProvider>
          <Outlet />
        </TooltipProvider>
      </main>

      {showNavbar && (
        <div
          className={`z-500 w-full left-1/2 -translate-x-1/2 right-0 bottom-0 pb-[1.6rem] sm:pb-[2.2rem]
              ${isFixed ? "fixed max-w-[calc(100%-2rem)] sm:max-w-[calc(100%-4rem)]" : "relative"} 
            `}
        >
          <BottomNavbar />
        </div>
      )}
    </OrientationGuard>
  );
}
