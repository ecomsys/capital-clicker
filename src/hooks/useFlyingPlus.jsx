// src/hooks/useFlyingPlus.jsx
import { useCallback, useRef } from 'react';

export const useFlyingPlus = () => {
  const activeAnimations = useRef(new Set()); // проще чем Map
  const lastCallTime = useRef(0);

  const createFlyingNumber = useCallback((startX, startY, targetRect) => {
    const div = document.createElement('div');
    div.textContent = '+1';
    div.style.position = 'fixed';
    div.style.left = `${startX - 30}px`;
    div.style.top = `${startY - 30}px`;
    div.style.fontSize = '2.5rem';        // чуть меньше, легче рендерить
    div.style.fontWeight = 'bold';
    div.style.fontFamily = 'system-ui, -apple-system, sans-serif';
    div.style.color = '#ffd966';
    div.style.textShadow = '1px 1px 0 #b45309'; // проще, без размытия
    div.style.whiteSpace = 'nowrap';
    div.style.pointerEvents = 'none';
    div.style.zIndex = '9999';
    // will-change убран

    document.body.appendChild(div);

    const targetX = targetRect.left + targetRect.width / 2;
    const targetY = targetRect.top + targetRect.height / 2;
    const deltaX = targetX - startX;
    const deltaY = targetY - startY;

    // Простая дуга без сложной кривой
    const arcHeight = 30;
    const midX = startX + deltaX * 0.5;
    const midY = startY + deltaY * 0.5 - arcHeight;
    const midDeltaX = midX - startX;
    const midDeltaY = midY - startY;

    // Используем CSS transition + таймеры? Нет, animate проще.
    // Но упрощаем keyframes и easing
    const animation = div.animate(
      [
        { transform: 'translate(0, 0) scale(0.6)', opacity: 1 },
        { transform: `translate(${midDeltaX}px, ${midDeltaY}px) scale(1)`, opacity: 1, offset: 0.4 },
        { transform: `translate(${deltaX}px, ${deltaY}px) scale(1.2)`, opacity: 0 }
      ],
      {
        duration: 1200,        // короче, быстрее очищается
        easing: 'ease-out',    // проще, чем cubic-bezier
        fill: 'forwards'
      }
    );

    const id = performance.now() + Math.random();
    activeAnimations.current.add(id);

    animation.onfinish = () => {
      div.remove();
      activeAnimations.current.delete(id);
    };
  }, []);

  const flyFromClick = useCallback((event, targetRef) => {
    if (!targetRef?.current) return;

    const now = Date.now();
    if (now - lastCallTime.current < 80) return; // чуть больше задержка для старых
    lastCallTime.current = now;

    const { clientX, clientY } = event;
    const targetRect = targetRef.current.getBoundingClientRect();
    createFlyingNumber(clientX, clientY, targetRect);
  }, [createFlyingNumber]);

  return { flyFromClick };
};