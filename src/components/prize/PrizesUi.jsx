// src/components/prize/PrizesUi.jsx
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Цвета по типам (без изменений)
const typeColors = {
  money: {
    textColor: "text-golden",
    border: "border-golden/30",
    activeBorder: "border-golden",
    activeShadow: "rgba(254, 141, 0, 0.5)",
    bg: "bg-tile ",
    activeBg: "from-golden/20 to-yellow-500/20",
  },
  gift: {
    textColor: "text-siniy",
    border: "border-siniy/30",
    activeBorder: "border-siniy",
    activeShadow: "rgba(127, 53, 255, 0.5)",
    bg: "bg-tile ",
    activeBg: "from-siniy/20 to-purple-500/20",
  },
  certificate: {
    textColor: "text-salat",
    border: "border-salat/30",
    activeBorder: "border-salat",
    activeShadow: "rgba(42, 255, 0, 0.5)",
    bg: "bg-tile ",
    activeBg: "from-salat/20 to-green-500/20",
  },
};

const getActiveShadow = (type) => {
  const colors = typeColors[type] || typeColors.money;
  return colors.activeShadow;
};

export function PrizesTitle({ children }) {
  return (
    <h2 className="mb-4 text-white text-2xl font-bold text-center">
      {children}
    </h2>
  );
}

// УНИВЕРСАЛЬНАЯ КАРТОЧКА — фикс: стили wide только для layout="wide"
export function PrizeCard({
  prize,
  isSelected,
  onSelect,
  textClasses,
  fullWidth = false,
  layout = "standard", // "standard" | "wide"
}) {
  const type = prize.type;
  const colors = typeColors[type] || typeColors.money;
  const isLocked = prize.locked;
  const isWide = layout === "wide";

  return (
    <motion.div
      whileTap={!isLocked ? { scale: 0.98 } : undefined}
      onClick={!isLocked ? onSelect : undefined}
      className={cn(
        // БАЗА
        "flex flex-col w-full h-[10.4375rem] rounded-xl p-4 text-center transition-all relative",
        "border-t border-l",
        colors.bg,
       
        isLocked ? colors.border : colors.activeBorder,

        // ТОЛЬКО для wide: на sm+ переключаем в row
        isWide && "sm:flex-row",

        // Состояния: ховер, актив, курсор
        isLocked
          ? "cursor-not-allowed"
          : cn(
              "cursor-pointer hover:bg-white/5",
              isSelected &&
                cn(
                  `bg-gradient-to-br ${colors.activeBg}`,
                  "border-2", 
                  `shadow-[0_0_0.9375rem_${getActiveShadow(type)}]`,
                ),
            ),

        // Grid span для фулл-вайдов
        fullWidth && "col-span-1 sm:col-span-2",
      )}
    >
      {/* Оверлей блокировки */}
      {isLocked && (
        <div className="absolute inset-0 bg-black/50 rounded-[1.5rem] flex flex-col items-center justify-center gap-1 z-10">
          <svg className="w-13.5 h-13.5" aria-hidden="true">
            <use href={`/icons/sprite/sprite.svg#lock`} />
          </svg>
          <span className="text-white text-[0.875rem] text-center px-1">
            <span>Для разблокировки</span>
            <br />
            <span className={`${colors.textColor}`}>пригласите друга</span>
          </span>
        </div>
      )}

      {/*  Контейнер картинки */}
      <div
        className={cn(
          "flex-1 flex items-center justify-center p-4 min-h-0 relative",
          isLocked && "opacity-30",
          //  ТОЛЬКО для wide: на sm+ картинка 1/3, слева, с отступом
          isWide && "sm:w-1/3 sm:flex-none sm:pr-2 sm:justify-start",
        )}
      >
        {prize.icon ? (
          <img
            src={prize.icon}
            alt={prize.title}
            className={cn(
              "object-contain w-25 h-25",
              // ТОЛЬКО для wide: на sm+ чуть меньше
              isWide && "sm:w-30 sm:h-30",
            )}
          />
        ) : (
          <div className="w-25 h-25 flex items-center justify-center text-white/20">
            <span className="text-xs">No Image</span>
          </div>
        )}
      </div>

      {/* Контейнер текста */}
      <div
        className={cn(
          "flex flex-col mt-auto pt-2",
          //  ТОЛЬКО для wide: на sm+ текст 2/3, в ряд, с отступом
          isWide &&
            "sm:flex-row sm:items-center sm:mt-0 sm:pt-0 sm:w-2/3 sm:pl-2 sm:justify-center",
        )}
      >
        <span
          className={cn(
            "font-bold text-center",
            textClasses,
            isLocked ? "text-white/40" : "text-white",
            //  ТОЛЬКО для wide: на sm+ большой шрифт, слева
            isWide &&
              "sm:text-left sm:text-[2rem] sm:leading-tight sm:font-extrabold",
          )}
        >
          {prize.title}
        </span>
      </div>
    </motion.div>
  );
}

// PrizeCardFullWidth — оригинальная вёрстка + поддержка locked 🔒
export function PrizeCardFullWidth({ prize, isSelected, onSelect }) {
  const type = prize.type;
  const colors = typeColors[type] || typeColors.money;
 const isLocked = prize.locked;

  const getImages = () => {
    // Оригинальные пути к картинкам — без изменений
    return {
      left: "/images/webp/cash/cash_left.webp",
      right: "/images/webp/cash/cash_right.webp",
    };
  };

  const images = getImages();
  const bgGradient = isSelected
    ? `bg-gradient-to-r ${colors.activeBg}`
    : "bg-[rgba(217,217,217,0.02)]";

  return (
  <motion.div
    whileTap={!isLocked ? { scale: 0.98 } : undefined}
    onClick={!isLocked ? onSelect : undefined}
    className={cn(
      "flex items-center justify-end sm:justify-center",
      "h-[7.875rem] rounded-[1.5rem] sm:text-center transition-all w-full relative overflow-hidden",
      "border-t border-l",
            
      isLocked ? colors.border : colors.activeBorder,
      
      bgGradient,
      
      // Состояния
      isLocked 
        ? "cursor-not-allowed" 
        : cn(
            "cursor-pointer hover:bg-white/5",
            isSelected && cn(
              "border-2", 
              `shadow-[0_0_0.9375rem_${getActiveShadow(type)}]`
            )
          )
    )}
  >
      {/* Оверлей блокировки — только если приз закрыт */}
      {isLocked && (
        <div className="absolute inset-0 bg-black/60 rounded-[1.5rem] flex flex-col items-center justify-center gap-1 z-10">
          <svg className="w-13.5 h-13.5" aria-hidden="true">
            <use href={`/icons/sprite/sprite.svg#lock`} />
          </svg>
          <span className="text-white/70 text-[0.625rem] sm:text-xs text-center px-2">
            <span>Для разблокировки</span>
            <br />
            <span className={`${colors.textColor}`}>пригласите друга</span>
          </span>
        </div>
      )}

      {/* Абсолютно позиционированное изображение слева — как в оригинале */}
      <div className="absolute left-0 top-5 sm:top-0 bottom-0 z-1">
        <img
          src={images.left}
          alt="left image"
          className={cn("w-auto h-full object-cover", isLocked && "opacity-30")}
        />
      </div>

      {/* Центральный текст — как в оригинале */}
      <div
        className={cn(
          "text-white font-bold text-[1.5rem] font-sanscond sm:font-sans sm:text-[2rem] px-8 sm:px-12 z-10 ",
          isLocked && "opacity-30",
        )}
      >
        {prize.title}
      </div>

      {/* Абсолютно позиционированное изображение справа — как в оригинале */}
      <div className="hidden sm:block absolute right-0 top-0 bottom-0 z-1">
        <img
          src={images.right}
          alt="right"
          className={cn("w-auto h-full object-cover", isLocked && "opacity-30")}
        />
      </div>
    </motion.div>
  );
}
