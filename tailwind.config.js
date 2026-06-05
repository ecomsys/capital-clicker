/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],

  safelist: [
    "block",
    "hidden",
    "xs:block",
    "xs:hidden",
    "xss:block",
    "xss:hidden",
    "sm:block",
    "sm:hidden",
    "md:block",
    "md:hidden",
    "lg:block",
    "lg:hidden",
    "xl:block",
    "xl:hidden",
    "2xl:block",
    "2xl:hidden",
    "3xl:block",
    "3xl:hidden",
  ],

  theme: {
    screens: {
      xs: "21.875rem", //350
      iphone: "25.625rem",   //410
      ssm: "36rem",   //576
      sm: "40rem", // маленькие планшеты 640
      md: "48rem", // планшеты 768
      lg: "64rem", // ноутбуки 1024
      xl: "80rem", // десктопы 1280
      "2xl": "96rem", // широкие мониторы 1536
      "3xl": "123.75rem", // твой макет на 1980
    },

    extend: {      
      colors:{
        tile: "rgb(217,217,217,0.02)",

        salat: '#2aff00',
        golden: "#FE8D00",
        siniy: "#7f35ff",
        
        navbar: "#282b30",
        navbarlink: "#838383",
      },
      fontFamily: {
        sans: ["OpenSans", "sans-serif"],
        sanscond: ["OpenSansCondensed", "sans-serif"],        
      },
      // backgroundImage: {
      //   "dark-gradient": "linear-gradient(145deg, #111 0%, #0c0c0c 100%)" ,        
      //   "dark-gradientrev": "linear-gradient(145deg, #0c0c0c 100%, #111 0%)" ,        
      // },
    },
  },

  plugins: [],
};
