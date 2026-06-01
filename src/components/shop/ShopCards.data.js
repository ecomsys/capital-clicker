// src/components/shop/ShopCards.data.js

import { shopServices } from "@/services/ShopServices";

  // Массив с данными для карточек
export const shopCardsData = [
    {
      id: 1,
      imageSrc: "/icons/collection/non.svg",
      imageAlt: "none",
      title: "Отключить рекламу",
      buttonText: "100 ₽/день",
      buttonIcon: "cart",
      onClick: shopServices.offAdClick,
    },
    {
      id: 2,
      imageSrc: "/images/webp/icons-png/kubok.webp",
      imageAlt: "Kubok",
      title: "Подписка на премиум призы",
      buttonText: "100 ₽/неделя",
      buttonIcon: "cart",
      onClick: shopServices.premiumClick,
    },
    {
      id: 3,
      imageSrc: "/images/webp/icons-png/click-speed.webp",
      imageAlt: "clicker speed",
      title: "Скорость кликера",
      buttonText: "200 ₽/сутки",
      buttonIcon: "cart",
      onClick: shopServices.speedClick,
      imageIcon: "x2",
    },
    {
      id: 4,
      imageSrc: "/images/webp/icons-png/auto-clicker.webp",
      imageAlt: "auto clicker",
      title: "Автокликер",
      buttonText: "Выбрать скорость",
       buttonIcon: "",
      onClick: shopServices.autoClick,
    },
    {
      id: 5,
      imageSrc: "/images/webp/icons-png/click-speed.webp",
      imageAlt: "buy clicks",
      title: "Купить клики 1000 шт.",
      buttonText: "1 ₽",
      buttonIcon: "cart",
      onClick: shopServices.buyClick,
    },
  ];
