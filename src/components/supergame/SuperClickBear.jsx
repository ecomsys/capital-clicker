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
        "relative w-full h-full flex items-center justify-center",
        "cursor-pointer transition-transform active:scale-95",
        "overflow-visible",
        "min-h-[4rem] min-w-[4rem]",
        "max-w-[18rem] sm:max-w-[27rem]",
      )}
      onClick={onClick}
    >
      {/* Вращающийся круг - абсолютно */}
      <div className="absolute inset-0 w-full h-full pointer-events-none flex items-center justify-center scale-95">
        <img
          ref={imgRef}
          onContextMenu={(e) => e.preventDefault()}
          src="/images/webp/circle.webp"
          alt=""
          className="w-full h-full object-contain scale-110"
        />
      </div>

      {/* Медведь - абсолютно поверх круга */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center">
        <img
          src="/images/webp/level-bears/level-super.webp"
          onContextMenu={(e) => e.preventDefault()}
          alt=""
          className="w-full h-full object-contain cursor-pointer transition-transform active:scale-95"
          draggable="false"
        />
      </div>
    </div>
  );
}
