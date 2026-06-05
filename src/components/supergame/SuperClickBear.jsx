// src/components/supergame/SuperClickBear.jsx
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

export default function SuperClickBear({ onClick, spinSpeed = 0.3 }) {
  const imgRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const keyframes = [
      { transform: "rotate(0deg)" },
      { transform: "rotate(360deg)" },
    ];
    const animation = img.animate(keyframes, {
      duration: 2000,
      iterations: Infinity,
      easing: "linear",
    });
    animationRef.current = animation;
    animation.playbackRate = spinSpeed;

    return () => animation.cancel();
  }, []);

  useEffect(() => {
    if (animationRef.current) {
      animationRef.current.playbackRate = spinSpeed;
    }
  }, [spinSpeed]);

  return (
    <div
      className={cn(
        "relative w-full",
        "min-w-[13rem] max-w-[58vw]",    
        "iphone:max-w-[62vw]",
        "sm:max-w-[45vh]",
        "lg:max-w-[36vh]",
        "xl:max-w-[29.5vh]",
        "2xl:max-w-[26vh]",
      )}
      onClick={onClick}
    >
      {/* Вращающийся круг – масштабируем с помощью отдельного блока, чтобы не конфликтовать с rotate */}
      <div className="absolute inset-0 w-full h-full pointer-events-none scale-110">
        <img
          ref={imgRef}
          onContextMenu={(e) => e.preventDefault()}
          src="/images/webp/circle.webp"
          alt=""
          className="w-full h-full object-contain"
        />
      </div>
      {/* Медведь */}
      <img
        src="/images/webp/level-bears/level-super.webp"
        onContextMenu={(e) => e.preventDefault()}
        alt=""
        className="w-full h-full object-cover cursor-pointer transition-transform active:scale-95"
        draggable="false"
      />
    </div>
  );
}
