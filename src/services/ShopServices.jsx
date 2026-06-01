// src/services/ShopServices.jsx
import useModalStore from "@/stores/useModalStore";
import { ClickSliderContent } from "@/components/shop/ClickSlider";

class ShopServices {
  // отключить рекламу
  offAdClick() {
    alert("Отключить рекламу !");
  }

  // подписка на премиум
  premiumClick() {
    alert("Подписка на премиум призы !");
  }

  // купить клики
  buyClick() {
    alert("Купить клики !");
  }

  // авто кликкер
  autoClick() {
    const { openModal } = useModalStore.getState();

    openModal({
      classes: "w-full sm:max-w-[33.75rem]",
      content: (
        <ClickSliderContent
          onBuy={(price, stepIndex) => {
            console.log(`Покупка на ${price}₽, шаг ${stepIndex}`);
            alert(`Купить за ${price} ₽?`);
          }}
          steps={[
            { info: "2 кл/сек", price: "50" },
            { info: "3 кл/сек", price: "100" },
            { info: "4 кл/сек", price: "150" },
            { info: "5 кл/сек", price: "550" },
            { info: "10 кл/сек", price: "1000" },
            { info: "15 кл/сек", price: "1500" },
            { info: "20 кл/сек", price: "50000" },
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
