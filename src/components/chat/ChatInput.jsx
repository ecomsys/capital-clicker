// src/components/chat/ChatInput.jsx

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/Button";

// Компонент инпута для ввода сообщения
export const ChatInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full mx-auto max-w-[50.625rem] rounded-[1rem] pt-4 pb-10 px-4 sm:px-8 border-t border-[rgb(255,255,255,0.08)]">
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Сообщите о проблеме"
          className="w-full flex gap-2 px-3 bg-[#171717] h-12 rounded-[1.125rem] border border-[rgb(255,255,255,0.06)] flex-1 
          placeholder:text-[#767676] focus:outline-none text-[0.875rem] sm:text-[1rem]"
        />

        <Button
          onClick={handleSend}
          disabled={!message.trim()}
          className={cn(
            "bg-golden hover:bg-golden/80 text-white rounded-xl px-4 py-2 h-12 sm:min-w-[9.9375rem]",
            "transition-all duration-200 active:scale-95",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100",
          )}
        >
          <span className="text-[0.875rem] font-semibold text-center">
            Отправить
          </span>
        </Button>
      </div>
    </div>
  );
};
