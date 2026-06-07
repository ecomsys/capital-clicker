// src/hooks/useCountUp.js
import { useState, useRef, useCallback } from "react";

export const useCountUp = () => {
  const [value, setValue] = useState(null);
  const [active, setActive] = useState(false);
  const rafRef = useRef(null);

  const start = useCallback((from, to, duration = 500) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const startTime = performance.now();
    const step = (now) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      const current = from + (to - from) * t;
      setValue(Math.floor(current));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setValue(null);
        setActive(false);
        rafRef.current = null;
      }
    };
    setActive(true);
    rafRef.current = requestAnimationFrame(step);
  }, []);

  const reset = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setValue(null);
    setActive(false);
    rafRef.current = null;
  }, []);

  return {
    countUpValue: value,
    isCountUpActive: active,
    startCountUp: start,
    resetCountUp: reset,
  };
};
