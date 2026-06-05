// src/app/Router.jsx
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Страницы
import SplashScreen from "@/pages/SplashScreen";
import HomePage from "@/pages/HomePage";
import FriendsPage from "@/pages/FriendsPage";
import ClansPage from "@/pages/ClansPage";
import ProfilePage from "@/pages/ProfilePage";
import ShopPage from "@/pages/ShopPage";
import PrizeSelectionPage from "@/pages/PrizeSelectionPage";
import EarnPage from "@/pages/EarnPage";
import ChatPage from "@/pages/ChatPage";
import SuperGamePage from "@/pages/SuperGamePage";
import WheelPage from "@/pages/WheelPage/index";
import MiniGamePage from "@/pages/MiniGame";

// Дополнительно
import { Animate } from "@/components/Animate";
import Layout from "@/layouts/Layout";

export function AppRouter() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Основной Layout (с ориентацией, wrapper и условным навбаром) */}
        <Route element={<Layout />}>
          <Route path="/splash" element={<Animate><SplashScreen /></Animate>} />
          <Route path="/home" element={<Animate><HomePage /></Animate>} />
          <Route path="/friends" element={<Animate><FriendsPage /></Animate>} />
          <Route path="/clans" element={<Animate><ClansPage /></Animate>} />
          <Route path="/profile" element={<Animate><ProfilePage /></Animate>} />
          <Route path="/shop" element={<Animate><ShopPage /></Animate>} />
          <Route path="/prize-selection" element={<Animate><PrizeSelectionPage /></Animate>} />
          <Route path="/earn" element={<Animate><EarnPage /></Animate>} />
          <Route path="/chat" element={<Animate><ChatPage /></Animate>} />
          <Route path="/super-game" element={<Animate><SuperGamePage /></Animate>} />
          <Route path="/wheel" element={<Animate><WheelPage /></Animate>} />
          <Route path="/mini-game" element={<Animate><MiniGamePage /></Animate>} />
        </Route>

        {/* Fallback: если путь неизвестен → на заставку */}
        <Route path="*" element={<Navigate to="/splash" replace />} />
      </Routes>
    </AnimatePresence>
  );
}
