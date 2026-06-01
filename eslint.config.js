import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{js,jsx}"],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: {
        ...globals.browser, // оставляем браузерные (window, document...)
        ...globals.node, // node.js глобальные переменные (process, __dirname, require...)
      },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },

    rules: {
      "react-refresh/only-export-components": ["off"],
    },
  },
]);
