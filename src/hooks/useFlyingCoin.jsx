// src/hooks/useFlyingCoin.jsx
import { useCallback, useRef } from "react";

export const useFlyingCoin = () => {
  const activeAnimations = useRef(new Set());
  const lastCallTime = useRef(0);
  const coinSizeInRem = 4;

  const createFlyingCoin = useCallback((startX, startY, targetRect) => {
    if (!targetRect || targetRect.width === 0 || targetRect.height === 0) return;
    if (activeAnimations.current.size >= 5) return;

    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const size = coinSizeInRem * rootFontSize;

    const img = document.createElement("img");
    img.src = "/images/gif/coin.gif";
    // Блокируем контекстное меню и выделение
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
      if (img && img.remove) img.remove();
      activeAnimations.current.delete(id);
    };
  }, []);

  const flyFromClick = useCallback((event) => {
    const now = Date.now();
    if (now - lastCallTime.current < 150) return;
    lastCallTime.current = now;

    const allChests = document.querySelectorAll(".treasure-chest");
    let chestContainer = null;
    for (let chest of allChests) {
      if (chest.offsetParent !== null) {
        chestContainer = chest;
        break;
      }
    }
    if (!chestContainer) return;

    const innerChests = chestContainer.querySelectorAll(".chest-inner");
    let visibleChest = null;
    for (let chest of innerChests) {
      const style = window.getComputedStyle(chest);
      if (style.display !== "none") {
        visibleChest = chest;
        break;
      }
    }
    if (!visibleChest) return;

    requestAnimationFrame(() => {
      const targetRect = visibleChest.getBoundingClientRect();
      if (targetRect.width === 0 || targetRect.height === 0) return;
      const { clientX, clientY } = event;
      createFlyingCoin(clientX, clientY, targetRect);
    });
  }, [createFlyingCoin]);

  return { flyFromClick };
};