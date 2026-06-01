// src/components/profile/CountrySelect.jsx

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useSettingsStore from "@/stores/useSettingsStore";

const countries = [
  { value: "ru", label: "Русский" },
  { value: "en", label: "Английский" },
];

// Дефолтное значение
const { language } = useSettingsStore.getState();

export function CountrySelect({ value, onChange, className = "" }) {
  return (
    <Select value={value ?? language} onValueChange={onChange}>
      <SelectTrigger
        className={`w-[10.4375rem] sm:w-[11.8125rem] text-[0.875rem] sm:text-[1rem] leading-[1.43] sm:leading-[1.25] pl-5 pr-4 py-5 rounded-[0.75rem] 
          text-white border-[#1d1d1d] active:scale-95 transition-all duration-200 ${className}`}
      >
        <SelectValue placeholder="Выбери страну" />
      </SelectTrigger>

      <SelectContent
        align="start"
        sideOffset={8}
        position="popper"
        className={`w-[10.4375rem] sm:w-[11.8125rem] bg-[#222] border-[#1d1d1d] rounded-[0.75rem] p-1 shadow-xl z-50`}
      >
        {countries.map((country, index) => (
          <SelectItem
            key={country.value}
            value={country.value}
            className={`text-[0.875rem] sm:text-[1rem] leading-[1.25] px-5 py-3 rounded-[0.5rem]
              text-white bg-transparent hover:bg-[#2a2a2a] hover:text-golden-400 focus:bg-[#2a2a2a]
              focus:text-golden-400 data-[highlighted]:bg-[#2a2a2a] data-[highlighted]:text-white data-[state=checked]:text-golden-400
              cursor-pointer transition-all duration-150 ${index !== countries.length - 1 ? "mb-1" : ""}`}
          >
            {country.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
