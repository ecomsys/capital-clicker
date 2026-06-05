// src/hooks/useFlyPrize.jsx
import { useCallback, useRef } from "react";
import { playSound } from "@/audio/manager";

export const useFlyPrize = () => {
  const activeAnimations = useRef(new Map());
  // const lastCallTime = useRef(0);
  const coinSizeInRem = 4; // размер монетки в rem

  const getVisibleElement = (selector) => {
    const elements = document.querySelectorAll(selector);
    for (let el of elements) {
      if (el.offsetParent !== null) {
        return el;
      }
    }
    return null;
  };

  const createFlyingCoinToTarget = useCallback((startX, startY, targetRect) => {
    if (!targetRect || targetRect.width === 0 || targetRect.height === 0) return;

    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const size = coinSizeInRem * rootFontSize;

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", String(size));
    svg.setAttribute("height", String(size));
    svg.setAttribute("viewBox", "0 0 36 36");
    svg.style.position = "fixed";
    svg.style.width = `${size}px`;
    svg.style.height = `${size}px`;
    svg.style.left = `${startX - size / 2}px`;
    svg.style.top = `${startY - size / 2}px`;
    svg.style.pointerEvents = "none";
    svg.style.zIndex = "9999";
    svg.style.willChange = "transform";

    // Градиент
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const gradient = document.createElementNS("http://www.w3.org/2000/svg", "radialGradient");
    gradient.setAttribute("id", "coinGradientFly");
    gradient.setAttribute("cx", "35%");
    gradient.setAttribute("cy", "35%");
    gradient.setAttribute("r", "70%");
    const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop1.setAttribute("offset", "0%");
    stop1.setAttribute("stop-color", "#FFF8DC");
    const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop2.setAttribute("offset", "60%");
    stop2.setAttribute("stop-color", "#FFD700");
    const stop3 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop3.setAttribute("offset", "100%");
    stop3.setAttribute("stop-color", "#D4AF37");
    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    gradient.appendChild(stop3);
    defs.appendChild(gradient);
    svg.appendChild(defs);

    const face = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    face.setAttribute("cx", "18");
    face.setAttribute("cy", "18");
    face.setAttribute("r", "16");
    face.setAttribute("fill", "url(#coinGradientFly)");
    face.setAttribute("stroke", "#B8860B");
    face.setAttribute("stroke-width", "1.5");
    svg.appendChild(face);

    const edge = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
    edge.setAttribute("cx", "18");
    edge.setAttribute("cy", "28");
    edge.setAttribute("rx", "14");
    edge.setAttribute("ry", "4");
    edge.setAttribute("fill", "#B8860B");
    edge.setAttribute("opacity", "0.8");
    svg.appendChild(edge);

    const innerCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    innerCircle.setAttribute("cx", "18");
    innerCircle.setAttribute("cy", "18");
    innerCircle.setAttribute("r", "12");
    innerCircle.setAttribute("fill", "#FFF8DC");
    innerCircle.setAttribute("fill-opacity", "0.4");
    innerCircle.setAttribute("stroke", "#DAA520");
    innerCircle.setAttribute("stroke-width", "1");
    svg.appendChild(innerCircle);

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", "18");
    text.setAttribute("y", "24");
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("font-size", "14");
    text.setAttribute("fill", "#B8860B");
    text.setAttribute("font-weight", "bold");
    text.textContent = "₽";
    svg.appendChild(text);

    document.body.appendChild(svg);

    const targetX = targetRect.left + targetRect.width / 2;
    const targetY = targetRect.top + targetRect.height / 2;

    const arcHeight = 80;
    const P0 = { x: startX, y: startY };
    const P2 = { x: targetX, y: targetY };
    const P1 = { x: (startX + targetX) / 2, y: (startY + targetY) / 2 - arcHeight };

    const steps = 30;
    const keyframes = [];

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = (1 - t) ** 2 * P0.x + 2 * (1 - t) * t * P1.x + t ** 2 * P2.x;
      const y = (1 - t) ** 2 * P0.y + 2 * (1 - t) * t * P1.y + t ** 2 * P2.y;
      const deltaX = x - startX;
      const deltaY = y - startY;
      const scale = 0.8 + t * 0.3;
      let opacity = t < 0.7 ? 1 : 1 - (t - 0.7) / 0.3;
      const rotateY = 720 * t; // 2 оборота
      const transform = `translate(${deltaX}px, ${deltaY}px) scale(${scale}) rotateY(${rotateY}deg)`;
      keyframes.push({ transform, opacity });
    }

    const animation = svg.animate(keyframes, {
      duration: 1000,
      easing: "linear",
      fill: "forwards",
    });

    const id = performance.now() + Math.random();
    activeAnimations.current.set(id, animation);
    animation.onfinish = async () => {
      // Воспроизводим звук монетки при приземлении
      try {
        await playSound("/sounds/coin-into.mp3", { volume: 0.50 });
      } catch (e) {
        console.warn("Sound play failed", e);
      }
      svg.remove();
      activeAnimations.current.delete(id);
    };
  }, []);

  const flyPrizeFromPoint = useCallback((startX, startY, targetSelector = '.user-balance') => {
    const targetEl = getVisibleElement(targetSelector);
    if (!targetEl) return;
    const targetRect = targetEl.getBoundingClientRect();
    if (targetRect.width === 0) return;
    createFlyingCoinToTarget(startX, startY, targetRect);
  }, [createFlyingCoinToTarget]);

  const flyPrizeFromElement = useCallback((element, targetSelector = '.user-balance') => {
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;
    flyPrizeFromPoint(startX, startY, targetSelector);
  }, [flyPrizeFromPoint]);

  return { flyPrizeFromPoint, flyPrizeFromElement };
};