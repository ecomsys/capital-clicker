// src/layouts/Layout.jsx

import { Outlet } from "react-router-dom";

// хуки
import { useLocation } from "react-router-dom";
import { useShouldShowNavbar } from "@/hooks/useShouldShowNavbar";

import OrientationGuard from "@/components/OrientationGuard";
import BottomNavbar from "@/components/basic/BottomNavbar";

// Лейаут компонент
export default function Layout() {
  const location = useLocation();
  const showNavbar = useShouldShowNavbar();

  // сравнение локаций
  const isSplash = location.pathname === "/splash";  
  
  const isFixed = true;
 
  return (
    <OrientationGuard className={`${isSplash ? "" : "bg-black"}`}>
      <div className="eco-container">
        <div className="min-h-screen flex flex-col relative">
          <main className="flex-1">
            <Outlet />
          </main>

          {showNavbar && (
            <div
              className={`z-500 w-full left-1/2 -translate-x-1/2 right-0 bottom-0 pb-[2.5rem] sm:pb-[3.125rem]
              ${isFixed ? "fixed max-w-[calc(100%-2rem)] sm:max-w-[calc(100%-4rem)]" : "absolute "} 
            `}
            >
              <BottomNavbar />
            </div>
          )}
        </div>
      </div>
    </OrientationGuard>
  );
}
