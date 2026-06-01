 // src/components/earn/EarnCards.data.js

 import { subscribeServices } from "@/services/SubscribeServices";
 
 // Массив с данными для карточек
  export const earnCardsData = [
    {
      id: 1,
      imageSrc: "/icons/collection/vk.svg",
      imageAlt: "Вконтакте",
      social: "Вконтакте",
      bonus: "100",
      onClick: () => {
        subscribeServices.vkontakte();
      },
    },
    {
      id: 2,
      imageSrc: "/icons/collection/dzen.svg",
      imageAlt: "Дзен",
      social: "Дзен",
      bonus: "100",
      onClick: () => {
        subscribeServices.dzen();
      },
    },
    {
     id: 3,
      imageSrc: "/images/webp/icons-png/ok.webp",
      imageAlt: "Одноклассники",
      social: "Одноклассники",
      bonus: "100",
      onClick: () => {
        subscribeServices.ok();
      },
    },
    {
      id: 4,
      imageSrc: "/icons/collection/rutube.svg",
      imageAlt: "Рутуб",
      imageClasses: "w-[8rem] h-[1.35rem]",
      social: "Рутуб",
      bonus: "100",
      onClick: () => {
        subscribeServices.rutube();
      },
    }
  ];