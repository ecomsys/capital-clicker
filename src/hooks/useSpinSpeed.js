// src/hooks/useSpinSpeed.js
import { useState, useRef, useCallback, useEffect } from "react";

export const useSpinSpeed = (initialSpeed = 0.1, setGlobalSpeed) => {
  const [localSpeed, setLocalSpeed] = useState(initialSpeed);
  const spinTimeoutRef = useRef(null);
  const spinTimeout2Ref = useRef(null);

  const updateSpeed = useCallback((newSpeed) => {
    setLocalSpeed(newSpeed);
  }, []);

  const applyDecay = useCallback(() => {
    if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
    if (spinTimeout2Ref.current) clearTimeout(spinTimeout2Ref.current);
    spinTimeoutRef.current = setTimeout(() => {
      setLocalSpeed(0.7);
      spinTimeout2Ref.current = setTimeout(() => {
        setLocalSpeed(0.3);
      }, 1000);
    }, 1500);
  }, []);

  // Синхронизация с глобальной скоростью
  useEffect(() => {
    setGlobalSpeed(localSpeed);
  }, [localSpeed, setGlobalSpeed]);

  // Очистка таймеров
  useEffect(() => {
    return () => {
      if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
      if (spinTimeout2Ref.current) clearTimeout(spinTimeout2Ref.current);
    };
  }, []);

  return {
    spinSpeed: localSpeed,
    setSpinSpeed: updateSpeed,
    applySpinDecay: applyDecay,
  };
};
