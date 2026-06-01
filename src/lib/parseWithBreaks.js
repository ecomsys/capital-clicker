import React from 'react';

/**
 * Преобразует строку с <br> в массив React-элементов.
 * @param {string} text - Исходная строка, может содержать <br>, <br/>, <br />
 * @returns {Array|null} Массив React-узлов
 */
export const parseWithBreaks = (text) => {
  if (!text) return null;

  const brRegex = /<br\s*\/?>/gi;
  const parts = text.split(brRegex);
  const brMatches = text.match(brRegex) || [];

  const result = [];
  for (let i = 0; i < parts.length; i++) {
    if (parts[i]) {
      result.push(parts[i]);
    }
    if (i < brMatches.length) {
      result.push(React.createElement('br', { key: `br-${i}` }));
    }
  }
  return result;
};