import { cn } from "@/lib/utils";
import { useRef, useEffect, useMemo } from "react";

export default function ClickBear({
  onClick,
  percent = 0,
  prize,
  onClaim,
  className,
}) {
  const circleRef = useRef(null);

  const radius = 82;
  const strokeWidth = 6;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percent / 100) * circumference;
  const isFull = percent >= 100;

  const { endX, endY, radiusCircle, fontSize } = useMemo(() => {
    const angle = (percent / 100) * 2 * Math.PI;
    const endX = 90 + normalizedRadius * Math.sin(angle);
    const endY = 90 - normalizedRadius * Math.cos(angle);
    let radiusCircle = 8 + (percent / 100) * 13;
    if (isFull) radiusCircle = 22;
    const fontSize = isFull ? 16 : 6 + (percent / 100) * 8;
    return { endX, endY, radiusCircle, fontSize };
  }, [percent, normalizedRadius, isFull]);

  useEffect(() => {
    if (isFull && onClaim && circleRef.current) {
      const rect = circleRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      onClaim(centerX, centerY);
    }
  }, [isFull, onClaim]);

  return (
    <div
      onClick={onClick}
      className={cn(
        className,
        "relative flex items-center justify-center",
        "cursor-pointer transition-transform active:scale-95",
        "overflow-visible",
        "min-h-[4rem] min-w-[4rem]",
        "max-w-[18rem] sm:max-w-[27rem]"       
      )}
    >
      {/* Медведь */}
      <img
        src="/images/webp/level-bears/level-1.webp"
        alt=""
        className="w-full h-full object-contain"
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
        style={{ WebkitTouchCallout: "none" }}
      />

      {/* SVG-круг */}
      <div className="absolute -inset-1.5 flex items-center justify-center pointer-events-none overflow-visible">
        <svg
          className="w-full h-full overflow-visible"
          viewBox="0 0 180 180"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="gradProgress" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#260957" />
              <stop offset="100%" stopColor="#5E27BD" />
            </linearGradient>
          </defs>

          <circle
            cx="90"
            cy="90"
            r={normalizedRadius}
            fill="none"
            stroke="#4B5563"
            strokeWidth={strokeWidth}
            opacity="0.4"
          />
          <circle
            cx="90"
            cy="90"
            r={normalizedRadius}
            fill="none"
            stroke="url(#gradProgress)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 90 90)"
            style={{ transition: "stroke-dashoffset 0.2s linear" }}
          />

          <g>
            <circle
              ref={circleRef}
              cx={endX}
              cy={endY}
              r={radiusCircle}
              fill={isFull ? "#FBBF24" : "#6B2BDA"}
              className={isFull ? "animate-pulse" : ""}
            />
            <text
              x={endX}
              y={endY}
              textAnchor="middle"
              dominantBaseline="central"
              fill={isFull ? "#260957" : "#FFFFFF"}
              fontSize={fontSize}
              fontWeight="bold"
              pointerEvents="none"
            >
              {prize}
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}