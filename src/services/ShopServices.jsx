// src/services/ShopServices.jsx
import useModalStore from "@/stores/useModalStore";
import { ClickSliderContent } from "@/components/shop/ClickSlider";

const { openModal } = useModalStore.getState();

class ShopServices {
  // отключить рекламу
  offAdClick() {
     openModal({
      classes: "w-full sm:max-w-[33.75rem]",
      content: (
        <ClickSliderContent
          title="Отключить рекламу"
          description=""
          onBuy={(price, stepIndex) => {
            console.log(`Покупка на ${price}₽, шаг ${stepIndex}`);
            alert(`Купить за ${price} ₽?`);
          }}
          steps={[
            { info: "1 день", price: "100" },
            { info: "7 дней", price: "700" },
            { info: "30 дней", price: "3000" },            
          ]}
          defaultIndex={1}
        />
      ),
    });
  }

  // подписка на премиум
  premiumClick() {
    alert("Подписка на премиум призы !");
  }

  // купить клики
  buyClick() {
     openModal({
      classes: "w-full sm:max-w-[33.75rem]",
      content: (
        <ClickSliderContent
          title="Купить клики"
          description=""
          onBuy={(price, stepIndex) => {
            console.log(`Покупка на ${price}₽, шаг ${stepIndex}`);
            alert(`Купить за ${price} ₽?`);
          }}
          steps={[
            { info: "1000 кликов", price: "1" },
            { info: "5 000 кликов", price: "5" },
            { info: "10 000 кликов", price: "10" },
            { info: "50 000 кликов", price: "50" },
            { info: "100 000 кликов", price: "100" },
            { info: "250 000 кликов", price: "250" },
            { info: "500 000 кликов", price: "500" },
            { info: "1 000 000 кликов", price: "1000" },            
          ]}
          defaultIndex={2}
        />
      ),
    });
  }

  // авто кликкер
  autoClick() {
    openModal({
      classes: "w-full sm:max-w-[33.75rem]",
      content: (
        <ClickSliderContent
          onBuy={(price, stepIndex) => {
            console.log(`Покупка на ${price}₽, шаг ${stepIndex}`);
            alert(`Купить за ${price} ₽?`);
          }}
          steps={[
            { info: "1 кл/сек", price: "100" },
            { info: "2 кл/сек", price: "150" },
            { info: "3 кл/сек", price: "200" },
            { info: "4 кл/сек", price: "250" },
            { info: "5 кл/сек", price: "300" },
            { info: "10 кл/сек", price: "500" },
            { info: "15 кл/сек", price: "750" },
            { info: "20 кл/сек", price: "1000" },
          ]}
          defaultIndex={3}
        />
      ),
    });
  }

  // сервис "Скорость кликкера"
  speedClick() {
    alert("Скорость кликкера х2");
  }
}

export const shopServices = new ShopServices();
