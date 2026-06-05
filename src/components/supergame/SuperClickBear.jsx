// src/components/supergame/SuperClickBear.jsx
import { useEffect, useRef } from "react";

export default function SuperClickBear({ onClick, spinSpeed = 0.3 }) {
  const imgRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    // Создаём анимацию вращения
    const keyframes = [
      { transform: "rotate(0deg)" },
      { transform: "rotate(360deg)" }
    ];
    const options = {
      duration: 2000,      // базовая длительность (2 секунды), но скорость будем менять через playbackRate
      iterations: Infinity,
      easing: "linear"
    };
    const animation = img.animate(keyframes, options);
    animationRef.current = animation;

    // Начальная скорость
    animation.playbackRate = spinSpeed;

    return () => {
      animation.cancel();
    };
  }, []); // пустой массив — создаём анимацию один раз

  // Плавное изменение скорости при изменении spinSpeed
  useEffect(() => {
    const anim = animationRef.current;
    if (anim) {
      // Меняем playbackRate плавно — браузер сам интерполирует скорость анимации
      anim.playbackRate = spinSpeed;
    }
  }, [spinSpeed]);

  return (
    <div
      className="relative min-w-[9rem] w-[66vw] max-w-[16rem] xss:w-[75vw] xss:max-w-[18rem] sm:w-[50vw] sm:max-w-[25rem] sm:min-w-[14.875rem] lg:max-w-[25vh]"
      onClick={onClick}
    >
      {/* Вращающийся круг — ссылка через ref */}
      <img
        ref={imgRef}
        src="/images/webp/circle.webp"
        alt=""
        className="absolute inset-0 w-full h-full object-contain pointer-events-none scale-110"
        style={{ willChange: "transform" }}
      />
      {/* Медведь */}
      <img
        src="/images/webp/level-bears/level-super.webp"
        alt="Super Game"
        className="w-full h-full object-cover cursor-pointer transition-transform active:scale-95"
        draggable="false"
      />
    </div>
  );
}