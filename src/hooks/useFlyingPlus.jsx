// src/hooks/useFlyingPlus.jsx
import { useCallback, useRef } from 'react';

export const useFlyingPlus = () => {
  const activeAnimations = useRef(new Map());
  const lastCallTime = useRef(0);

  const createFlyingNumber = useCallback((startX, startY, targetRect) => {
    const div = document.createElement('div');
    div.className = 'flying-plus';
    div.textContent = '+1';
    div.style.position = 'fixed';
    div.style.left = `${startX - 30}px`;   // немного смещено от центра
    div.style.top = `${startY - 30}px`;
    div.style.fontSize = '3rem';           // крупнее
    div.style.fontWeight = 'bold';
    div.style.fontFamily = 'system-ui, -apple-system, sans-serif';
    div.style.color = '#ffd966';
    div.style.textShadow = '0 0 0.5rem #b45309, 0 0 0.2rem #000';
    div.style.whiteSpace = 'nowrap';
    div.style.pointerEvents = 'none';
    div.style.zIndex = '9999';
    div.style.willChange = 'transform, opacity';

    document.body.appendChild(div);

    const targetX = targetRect.left + targetRect.width / 2;
    const targetY = targetRect.top + targetRect.height / 2;
    const deltaX = targetX - startX;
    const deltaY = targetY - startY;

    // Параметры дуги для +1 (лёгкий подскок)
    const arcHeight = 30;                  // высота дуги
    const midX = startX + deltaX * 0.5;
    const midY = startY + deltaY * 0.5 - arcHeight;
    const midDeltaX = midX - startX;
    const midDeltaY = midY - startY;

    const animation = div.animate(
      [
        { transform: 'translate(0, 0) scale(0.5)', opacity: 1 },
        { transform: `translate(${midDeltaX}px, ${midDeltaY}px) scale(1.1)`, opacity: 1, offset: 0.4 },
        { transform: `translate(${deltaX}px, ${deltaY}px) scale(1.3)`, opacity: 0 }
      ],
      {
        duration: 2000,                   // дольше (1 секунда)
        easing: 'cubic-bezier(0.2, 0.9, 0.4, 1.1)',
        fill: 'forwards'
      }
    );

    const id = performance.now() + Math.random();
    activeAnimations.current.set(id, animation);

    animation.onfinish = () => {
      div.remove();
      activeAnimations.current.delete(id);
    };
  }, []);

  const flyFromClick = useCallback((event, targetRef) => {
    if (!targetRef?.current) return;

    const now = Date.now();
    if (now - lastCallTime.current < 50) return;
    lastCallTime.current = now;

    const { clientX, clientY } = event;
    const targetRect = targetRef.current.getBoundingClientRect();
    createFlyingNumber(clientX, clientY, targetRect);
  }, [createFlyingNumber]);

  return { flyFromClick };
};