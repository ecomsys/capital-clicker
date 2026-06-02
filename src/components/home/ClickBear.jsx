// src/components/home/ClickBear.jsx
export default function ClickBear({ onClick, percent = 0, prize }) {
  const radius = 82;
  const strokeWidth = 6;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percent / 100) * circumference;
  const isFull = percent >= 100;

  const angle = (percent / 100) * 2 * Math.PI;
  const centerX = 90;
  const centerY = 90;
  const endX = centerX + normalizedRadius * Math.sin(angle);
  const endY = centerY - normalizedRadius * Math.cos(angle);

  return (
    <div className="relative cursor-pointer transition-transform active:scale-95 inline-block" onClick={onClick}>
      <div className="relative w-full  mx-auto overflow-visible
      min-w-[9rem] w-[69vw] max-w-[13.75rem] xss:w-[78vw] xss:max-w-[20rem] sm:w-[38vw] sm:max-w-[25rem] sm:min-w-[14.875rem] lg:w-[33vh] lg:max-w-[21.5rem] cursor-pointer transition-transform active:scale-95
      ">
        <img 
          src="/images/webp/level-bears/level-1.webp" 
          alt="Уровень 1" 
          className="relative w-full h-full object-cover "
          draggable="false"
        />
        
        <div className="absolute -inset-3 flex items-center justify-center pointer-events-none overflow-visible">
          <svg
            className="w-full h-full overflow-visible z-10"
            viewBox="0 0 180 180"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="gradProgress" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#260957" />
                <stop offset="100%" stopColor="#5E27BD" />
              </linearGradient>
            </defs>

            {/* Фоновый круг */}
            <circle
              cx="90"
              cy="90"
              r={normalizedRadius}
              fill="none"
              stroke="#4B5563"
              strokeWidth={strokeWidth}
              opacity="0.4"
            />
            {/* Прогресс с градиентом */}
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
              style={{ transition: 'stroke-dashoffset 0.2s linear' }}
            />
            
            {/* Кружок виден всегда, даже при 0% */}
            <g>
              <circle
                cx={endX}
                cy={endY}
                r="14"
                fill={isFull ? "#FBBF24" : "#6B2BDA"}                 
                className={isFull ? "animate-pulse" : ""}
              />
              <text
                x={endX}
                y={endY}
                textAnchor="middle"
                dominantBaseline="central"
                fill={isFull ? "#260957" : "#FFFFFF"}
                fontSize="10"
                fontWeight="bold"
                pointerEvents="none"
              >
                {prize}
              </text>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}