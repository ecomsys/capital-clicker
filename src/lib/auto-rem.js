// lib/auto-rem.js

export function getScaleFactor(baseSiteWidth = 1536) {
  // Если ширина >= базовой — считаем динамически
  if (window.innerWidth >= baseSiteWidth) {
    return window.innerWidth / baseSiteWidth;
  }
  // Иначе — 1 (адаптивный режим)
  return 1;
}

export function initAutoRem({ baseSiteWidth = 1536, baseFontSize = 16 } = {}) {
  const htmlElement = document.documentElement;

  function updateFontSize() {
      const viewportWidth = window.innerWidth;

    // Для мобилок (≤640px) – без коэффициента, для десктопа – умножаем на 0.66
    const screenWidth = viewportWidth <= 640 
      ? viewportWidth 
      : viewportWidth * 0.66;

    // const screenWidth = 1536;
    const scaleFactor = screenWidth / baseSiteWidth;

    if (screenWidth >= baseSiteWidth) {
      const newFontSize = baseFontSize * scaleFactor;
      htmlElement.style.fontSize = `${newFontSize}px`;
      console.log("forced rem mode:", {
        screenWidth,
        baseSiteWidth,
        scaleFactor,
      });
    } else if (screenWidth < baseSiteWidth && screenWidth > 1024 * 0.66) {
      const newFontSize = baseFontSize * scaleFactor;
      htmlElement.style.fontSize = `${newFontSize}px`;
    } else {
      htmlElement.style.fontSize = "1rem";
      console.log("adaptive rem mode:", { screenWidth });
    }
  }

  window.addEventListener("resize", updateFontSize);
  updateFontSize(); // Первый вызов

  return () => window.removeEventListener("resize", updateFontSize);
}
