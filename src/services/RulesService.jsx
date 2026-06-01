// src/services/RulesService.js
import useModalStore from "@/stores/useModalStore";
import { parseWithBreaks } from "@/lib/parseWithBreaks"; // ← импорт

class RulesService {
  async loadRules(rulesDataUrl) {
    try {
      const response = await fetch(rulesDataUrl);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Ошибка загрузки правил:", error);
      return null;
    }
  }

  async openRulesModal(rulesDataUrl, superGame = false) {
    const data = await this.loadRules(rulesDataUrl);
    if (!data) return;

    const { openModal } = useModalStore.getState();
    openModal({
      classes: superGame ? "sm:max-w-[61.3125rem]" : "sm:max-w-[41.3125rem]",
      content: (
        <div className="px-4 sm:px-10 space-y-2 text-white font-light">
          <div className="pb-1 pt-7 text-center">
            <p className="text-xl font-semibold">{data.title}</p>
          </div>
          {data.rules.map((rule, index) => (
            <div key={index} className="flex items-start">
              <span className="text-[1rem] min-w-[1.5rem]">{index + 1}.</span>
              <p className="text-[1rem] leading-[1.5]">{parseWithBreaks(rule)}</p>
            </div>
          ))}
          <div className="pt-5 pb-10 text-center">
            <p className="text-xl font-bold uppercase">{data.wish}</p>
          </div>
        </div>
      ),
    });
  }
}

export const rulesService = new RulesService();
