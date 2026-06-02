// src/layouts/Layout.jsx

import { Outlet } from "react-router-dom";

// хуки
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useShouldShowNavbar } from "@/hooks/useShouldShowNavbar";

// сервисы
import { accountServices } from "@/services/AccountServices";

// компооненты
import { Animate } from "@/components/Animate";
import { Button } from "@/components/ui/Button";
import OrientationGuard from "@/components/OrientationGuard";
import BottomNavbar from "@/components/basic/BottomNavbar";
import HomeActionsGrid from "@/components/home/HomeActionsGrid";
import SuperGameActionsGrid from "@/components/supergame/SuperGameActionsGrid";

// Лейаут компонент
export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const showNavbar = useShouldShowNavbar();

  // сравнение локаций
  const isSplash = location.pathname === "/splash";
  const isHomePage = location.pathname === "/home";
  // const isClansPage = location.pathname === "/clans";
  const isFriendsPage = location.pathname === "/friends";
  const isProfilePage = location.pathname === "/profile";
   const isShopPage = location.pathname === "/shop";
  const isEarnPage = location.pathname === "/earn";
  const isPrizeSelectionPage = location.pathname === "/prize-selection";
  const isSuperGamePage = location.pathname === "/super-game";

  const isFixed = true;

  const isBgFull =
    isProfilePage === true ||
    isFriendsPage === true ||
    isEarnPage === true ||
    isPrizeSelectionPage === true || 
    isShopPage === true ;

  return (
    <OrientationGuard className={`${isSplash ? "" : "bg-black"}`}>
      <div className="eco-container">
        <div className="min-h-screen flex flex-col relative">
          <main className="flex-1">
            <Outlet />
          </main>

          {showNavbar && (
            <div
             className={`${isBgFull ? "bg-black" : ""} z-500 w-full left-1/2 -translate-x-1/2 right-0 bottom-0 pb-[2.5rem] sm:pb-[3.125rem] 2xl:pb-[4.375rem]
            ${isFixed ? "fixed max-w-[calc(100%-2rem)] sm:max-w-[calc(100%-4rem)]" : "absolute "} 
            `}
            >
              {/* На странице друзья */}
              {isFriendsPage && (
                <Animate>
                  <div className="min-w-[18rem] mt-auto pb-5 sm:pb-10 flex justify-center">
                    <Button className="max-w-[46.625rem] w-full rounded-[1.125rem] px-3 h-[3.25rem] bg-golden hover:bg-golden/80 active:scale-95">
                      <span className="text-[1.0625rem]">Пригласить друга</span>
                    </Button>
                  </div>
                </Animate>
              )}

              {isProfilePage && (
                <Animate>
                  <div className="min-w-[18rem] mt-auto pb-5 sm:pb-10 flex flex-col justify-center pt-2">
                    <button
                      className="mx-auto mb-4 cursor-pointer text-[#ff3f3f] hover:text-[#ff3f3f]/80 transition text-base text-center"
                      onClick={() => accountServices.deleteAccount()}
                    >
                      Удалить аккаунт
                    </button>

                    <Button
                      onClick={() => {
                        navigate("/chat");
                      }}
                      className="mx-auto max-w-[46.625rem] w-full rounded-[1.125rem] px-3 h-[3.25rem] text-golden border-golden bg-[transparent] hover:bg-golden/10 active:scale-95"
                    >
                      <span className="text-[1.0625rem]">Поддержка</span>
                    </Button>
                  </div>
                </Animate>
              )}

              {isHomePage && (
                <Animate>
                  <div className="min-w-[18rem] mt-auto pb-4 flex justify-center">
                    <HomeActionsGrid />
                  </div>
                </Animate>
              )}

              {isSuperGamePage && (
                <Animate>
                  <div className="min-w-[18rem] mt-auto pb-4 flex sm:justify-center">
                    <SuperGameActionsGrid />
                  </div>
                </Animate>
              )}

              <BottomNavbar />
            </div>
          )}
        </div>
      </div>
    </OrientationGuard>
  );
}
