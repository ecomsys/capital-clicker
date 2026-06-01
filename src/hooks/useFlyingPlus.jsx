// src/hooks/useFlyingPlus.jsx
import { useCallback, useRef } from 'react';
// import { createPortal } from 'react-dom';

export const useFlyingPlus = () => {
  const activeAnimations = useRef(new Map()); // id -> animation
  const lastCallTime = useRef(0);

  const createFlyingNumber = useCallback((startX, startY, targetRect) => {
    // Создаём временный div
    const div = document.createElement('div');
    div.className = 'flying-plus';
    div.textContent = '+1';
    div.style.position = 'fixed';
    div.style.left = `${startX - 20}px`;
    div.style.top = `${startY - 20}px`;
    div.style.fontSize = '2rem';
    div.style.fontWeight = 'bold';
    div.style.color = '#ffd966';
    div.style.textShadow = '0 0 0.375rem #b45309, 0 0 0.125rem #000';
    div.style.whiteSpace = 'nowrap';
    div.style.pointerEvents = 'none';
    div.style.zIndex = '9999';
    div.style.willChange = 'transform, opacity';

    document.body.appendChild(div);

    const targetX = targetRect.left + targetRect.width / 2;
    const targetY = targetRect.top + targetRect.height / 2;
    const deltaX = targetX - startX;
    const deltaY = targetY - startY;

    // Анимация через Web Animations API
    const animation = div.animate(
      [
        { transform: 'translate(0,0) scale(0.6)', opacity: 1 },
        { transform: `translate(${deltaX}px, ${deltaY}px) scale(1.2)`, opacity: 0 }
      ],
      {
        duration: 700,
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

    // Защита от дублей (50 мс)
    const now = Date.now();
    if (now - lastCallTime.current < 50) return;
    lastCallTime.current = now;

    const { clientX, clientY } = event;
    const targetRect = targetRef.current.getBoundingClientRect();
    createFlyingNumber(clientX, clientY, targetRect);
  }, [createFlyingNumber]);


  return { flyFromClick};
};