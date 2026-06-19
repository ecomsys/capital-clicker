// hooks/useWindowSize.js
import { useLayoutEffect, useState } from 'react';

const MOBILE_BREAKPOINT = 768;

export const useWindowSize = () => {
  const [size, setSize] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
    isMobile: typeof window !== 'undefined' 
      ? window.innerWidth < MOBILE_BREAKPOINT 
      : false,
  }));

  useLayoutEffect(() => {
    const updateSize = () => {
      const width = window.visualViewport?.width ?? window.innerWidth;
      const height = window.visualViewport?.height ?? window.innerHeight;
      const isMobile = width < MOBILE_BREAKPOINT;

      setSize({ width, height, isMobile });
    };

    updateSize();

    window.visualViewport?.addEventListener('resize', updateSize);
    window.addEventListener('resize', updateSize);

    return () => {
      window.visualViewport?.removeEventListener('resize', updateSize);
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  return size;
};