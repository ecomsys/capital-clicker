// src/hooks/useToast.js
import { useState, useCallback, useRef } from "react";

export const useToast = (defaultDuration = 2000) => {
  const [message, setMessage] = useState(null);
  const [visible, setVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const timerRef = useRef(null);

  const showToast = useCallback(
    (text, duration = defaultDuration) => {
      setMessage(text);
      setVisible(true);
      setIsLeaving(false);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setIsLeaving(true);
        setTimeout(() => {
          setVisible(false);
          setIsLeaving(false);
        }, 300); // длительность анимации ухода
      }, duration);
    },
    [defaultDuration],
  );

  return {
    toastMessage: message,
    toastVisible: visible,
    toastLeaving: isLeaving,
    showToast,
  };
};
