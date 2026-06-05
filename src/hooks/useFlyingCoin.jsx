// src/hooks/useFlyingCoin.jsx
import { useCallback, useRef, useEffect } from "react";

export const useFlyingCoin = () => {
  const activeAnimations = useRef(new Map());
  const lastCallTime = useRef(0);

  const coinSizeInRem = 4;

  const createFlyingCoin = useCallback((startX, startY, targetRect) => {
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

    // Добавляем определение градиента
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const gradient = document.createElementNS("http://www.w3.org/2000/svg", "radialGradient");
    gradient.setAttribute("id", "coinGradient");
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

    // Лицевая сторона монетки (градиент)
    const face = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    face.setAttribute("cx", "18");
    face.setAttribute("cy", "18");
    face.setAttribute("r", "16");
    face.setAttribute("fill", "url(#coinGradient)");
    face.setAttribute("stroke", "#B8860B");
    face.setAttribute("stroke-width", "1.5");
    svg.appendChild(face);

    // Ребро (толщина) – тёмная полоска внизу, будет видна при вращении
    const edge = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
    edge.setAttribute("cx", "18");
    edge.setAttribute("cy", "28");
    edge.setAttribute("rx", "14");
    edge.setAttribute("ry", "4");
    edge.setAttribute("fill", "#B8860B");
    edge.setAttribute("opacity", "0.8");
    svg.appendChild(edge);

    // Внутренний круг (светлый блик)
    const innerCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    innerCircle.setAttribute("cx", "18");
    innerCircle.setAttribute("cy", "18");
    innerCircle.setAttribute("r", "12");
    innerCircle.setAttribute("fill", "#FFF8DC");
    innerCircle.setAttribute("fill-opacity", "0.4");
    innerCircle.setAttribute("stroke", "#DAA520");
    innerCircle.setAttribute("stroke-width", "1");
    svg.appendChild(innerCircle);

    // Текст рубля
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
    animation.onfinish = () => {
      svg.remove();
      activeAnimations.current.delete(id);
    };
  }, []);

  const flyFromClick = useCallback(
    (event) => {
      const now = Date.now();
      if (now - lastCallTime.current < 100) return;
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
    },
    [createFlyingCoin]
  );

  useEffect(() => {
    if (!document.querySelector("#flying-coin-styles")) {
      const style = document.createElement("style");
      style.id = "flying-coin-styles";
      style.textContent = `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 0.6s linear infinite;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return { flyFromClick };
};