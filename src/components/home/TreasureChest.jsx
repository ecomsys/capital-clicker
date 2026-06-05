import { cn } from "@/lib/utils";

export default function TreasureChest({
  progress = 50, 
  chestUrl = "/images/webp/icons-png/sunduk.webp",
  className,
  ...props
}) {
  const perimeter = 369; // длина пути (не менялась)
  const dashoffset = perimeter * (1 - progress / 100);

  return (
    <div
      className={cn(
        "treasure-chest relative max-w-[6.875rem] overflow-visible",
        "cursor-pointer",
        className,
      )}     
      {...props}
    >
      <div className="chest-inner chest-desktop aspect-[110/88] w-full">
        <svg
          viewBox="0 0 110 88"
          className="w-full h-full overflow-visible"
          fill="none"
        >
          <rect x="0" y="0" width="110" height="88" rx="16" fill="#202020" />

          {/* Трек */}
          <rect
            x="0"
            y="0"
            width="110"
            height="88"
            rx="12"
            fill="none"
            stroke="#4A4A4A"
            strokeWidth="2"
          />

          {/* Прогресс – теперь ПО ЧАСОВОЙ стрелке, старт сверху-посередине */}
          <path
            d="M 55,0
              L 94,0
              A 16,16 0 0 1 110,16
              L 110,72
              A 16,16 0 0 1 94,88
              L 16,88
              A 16,16 0 0 1 0,72
              L 0,16
              A 16,16 0 0 1 16,0
              L 55,0"
            fill="none"
            stroke="#FE8D00"
            strokeWidth="4"
            strokeDasharray={perimeter}
            strokeDashoffset={dashoffset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.3s ease" }}
          />

          <image
            href={chestUrl}
            x="25"
            y="14"
            width="60"
            height="60"
            preserveAspectRatio="xMidYMid meet"
          />

          {progress >= 100 && (
            <text
              x="55"
              y="44"
              textAnchor="middle"
              fill="#FFD700"
              fontSize="16"
            >
              ✨
            </text>
          )}
        </svg>
      </div>
    </div>
  );
}