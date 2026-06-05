// src/hooks/useFlyPrize.jsx
import { useCallback, useRef } from "react";
import { playSound } from "@/audio/manager";

export const useFlyPrize = () => {
  const activeAnimations = useRef(new Set());
  const coinSizeInRem = 4;

  const getVisibleElement = (selector) => {
    const elements = document.querySelectorAll(selector);
    for (let el of elements) {
      if (el.offsetParent !== null) return el;
    }
    return null;
  };

  const createFlyingCoinToTarget = useCallback((startX, startY, targetRect) => {
    if (!targetRect || targetRect.width === 0 || targetRect.height === 0) return;
    if (activeAnimations.current.size >= 5) return;

    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const size = coinSizeInRem * rootFontSize;

    const img = document.createElement("img");
    img.src = "/images/gif/coin.gif";
    // Блокируем контекстное меню
    img.draggable = false;
    img.style.userSelect = "none";
    img.style.webkitTouchCallout = "none";
    img.addEventListener("contextmenu", (e) => e.preventDefault());

    img.style.position = "fixed";
    img.style.width = `${size}px`;
    img.style.height = `${size}px`;
    img.style.left = `${startX - size / 2}px`;
    img.style.top = `${startY - size / 2}px`;
    img.style.pointerEvents = "none";
    img.style.zIndex = "9999";
    img.style.objectFit = "contain";

    document.body.appendChild(img);

    const targetX = targetRect.left + targetRect.width / 2;
    const targetY = targetRect.top + targetRect.height / 2;

    const arcHeight = 80;
    const P0 = { x: startX, y: startY };
    const P2 = { x: targetX, y: targetY };
    const P1 = { x: (startX + targetX) / 2, y: (startY + targetY) / 2 - arcHeight };

    const steps = 16;
    const keyframes = [];

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = (1 - t) ** 2 * P0.x + 2 * (1 - t) * t * P1.x + t ** 2 * P2.x;
      const y = (1 - t) ** 2 * P0.y + 2 * (1 - t) * t * P1.y + t ** 2 * P2.y;
      const deltaX = x - startX;
      const deltaY = y - startY;
      const scale = 0.8 + t * 0.3;
      let opacity = t < 0.7 ? 1 : 1 - (t - 0.7) / 0.3;
      const transform = `translate(${deltaX}px, ${deltaY}px) scale(${scale})`;
      keyframes.push({ transform, opacity });
    }

    const animation = img.animate(keyframes, {
      duration: 1000,
      easing: "linear",
      fill: "forwards",
    });

    const id = performance.now() + Math.random();
    activeAnimations.current.add(id);
    animation.onfinish = () => {
      playSound("/sounds/coin-into.mp3", { volume: 0.5 }).catch(console.warn);
      if (img && img.remove) img.remove();
      activeAnimations.current.delete(id);
    };
  }, []);

  const flyPrizeFromPoint = useCallback((startX, startY, targetSelector = ".user-balance") => {
    const targetEl = getVisibleElement(targetSelector);
    if (!targetEl) return;
    const targetRect = targetEl.getBoundingClientRect();
    if (targetRect.width === 0) return;
    createFlyingCoinToTarget(startX, startY, targetRect);
  }, [createFlyingCoinToTarget]);

  const flyPrizeFromElement = useCallback((element, targetSelector = ".user-balance") => {
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;
    flyPrizeFromPoint(startX, startY, targetSelector);
  }, [flyPrizeFromPoint]);

  return { flyPrizeFromPoint, flyPrizeFromElement };
};