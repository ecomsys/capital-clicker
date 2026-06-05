import { cn } from "@/lib/utils";

export default function TreasureChest({
    progress = 69,
    chestUrl = "/images/webp/icons-png/sunduk.webp",
    className,
    ...props
  }) {
  // Десктоп: периметр с rx=16
  const desktopPerimeter = 369;
  const desktopDashoffset = desktopPerimeter * (1 - progress / 100);
  const desktopPath = `
    M 55,0
    L 16,0
    A 16,16 0 0 0 0,16
    L 0,72
    A 16,16 0 0 0 16,88
    L 94,88
    A 16,16 0 0 0 110,72
    L 110,16
    A 16,16 0 0 0 94,0
    L 55,0
  `;

  // Мобилка: периметр с rx=16
  const mobilePerimeter = 331;
  const mobileDashoffset = mobilePerimeter * (1 - progress / 100);
  const mobilePath = `
    M 55,0
    L 16,0
    A 16,16 0 0 0 0,16
    L 0,53
    A 16,16 0 0 0 16,69
    L 94,69
    A 16,16 0 0 0 110,53
    L 110,16
    A 16,16 0 0 0 94,0
    L 55,0
  `;

  return (
    <div
      className={cn(
        "treasure-chest relative max-w-[6.875rem] w-full overflow-visible",
        "cursor-pointer",
        className,
      )}
      {...props}
    >
      {/* Десктоп (≥ sm) */}
      <div className="chest-inner chest-desktop  hidden sm:block aspect-[110/88] w-full">
        <svg
          viewBox="0 0 110 88"
          className="w-full h-full overflow-visible"
          fill="none"
        >
          <rect x="0" y="0" width="110" height="88" rx="16" fill="#202020" />
          <rect
            x="0"
            y="0"
            width="110"
            height="88"
            rx="16"
            fill="none"
            stroke="#4A4A4A"
            strokeWidth="2"
          />
          <path
            d={desktopPath}
            fill="none"
            stroke="#FE8D00"
            strokeWidth="4"
            strokeDasharray={desktopPerimeter}
            strokeDashoffset={desktopDashoffset}
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

      {/* Мобилка (< sm) */}
      <div className="chest-inner chest-mobile block sm:hidden aspect-[110/69] w-full">
        <svg
          viewBox="0 0 110 69"
          className="w-full h-full overflow-visible"
          fill="none"
        >
          <rect x="0" y="0" width="110" height="69" rx="16" fill="#202020" />
          <rect
            x="0"
            y="0"
            width="110"
            height="69"
            rx="16"
            fill="none"
            stroke="#4A4A4A"
            strokeWidth="2"
          />
          <path
            d={mobilePath}
            fill="none"
            stroke="#FE8D00"
            strokeWidth="4"
            strokeDasharray={mobilePerimeter}
            strokeDashoffset={mobileDashoffset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.3s ease" }}
          />
          <image
            href={chestUrl}
            x="25"
            y="5"
            width="60"
            height="60"
            preserveAspectRatio="xMidYMid meet"
          />
          {progress >= 100 && (
            <text
              x="55"
              y="35"
              textAnchor="middle"
              fill="#FFD700"
              fontSize="14"
            >
              ✨
            </text>
          )}
        </svg>
      </div>
    </div>
  );
}
