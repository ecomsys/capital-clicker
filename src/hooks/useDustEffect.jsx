// src/hooks/useDustEffect.jsx
import { useCallback } from 'react';

export const useDustEffect = () => {
  const createDustCloud = useCallback((x, y) => {
    // Адаптивный размер: получаем root font size
    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    // Базовый размер частицы в rem (от 1.2rem до 2.2rem)
    const minSizeRem = 0.6;
    const maxSizeRem = 1.7;
    
    const particleCount = 8;
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2 + Math.random() * 0.6;
      const distance = 50 + Math.random() * 10;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance - 10;

      const particle = document.createElement('div');
      particle.style.position = 'fixed';
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      
      // Размер в пикселях, зависящий от rem
      const sizeRem = minSizeRem + Math.random() * (maxSizeRem - minSizeRem);
      const sizePx = sizeRem * rootFontSize;
      particle.style.width = `${sizePx}px`;
      particle.style.height = `${sizePx}px`;
      
      particle.style.backgroundColor = '#e8c468';
      particle.style.borderRadius = '50%';
      particle.style.pointerEvents = 'none';
      particle.style.zIndex = '999999';
      particle.style.transform = 'translate(-50%, -50%) scale(0)';

      document.body.appendChild(particle);

      const duration = 450;
      const animation = particle.animate(
        [
          { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
          { transform: `translate(${tx}px, ${ty}px) scale(1)`, opacity: 0.7, offset: 0.4 },
          { transform: `translate(${tx * 1.2}px, ${ty * 1.1}px) scale(0)`, opacity: 0 }
        ],
        { duration, easing: 'ease-out', fill: 'forwards' }
      );
      animation.onfinish = () => particle.remove();
    }
  }, []);

  const dustOnClick = useCallback((event) => {
    const { clientX, clientY } = event;
    createDustCloud(clientX, clientY);
  }, [createDustCloud]);

  return { dustOnClick, createDustCloud };
};