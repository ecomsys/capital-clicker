// src/components/chat/Messages.jsx

import { cn } from "@/lib/utils";

// Компонент дня с сообщениями
export const MessageDay = ({ date, messages }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-center pb-2">
        <span className="text-[0.8125rem] leading-[1.38] text-white/20">{date}</span>
      </div>
      {messages.map((message, idx) => (
        <Message
          key={message.id}
          message={message}
          isOwn={message.isOwn}
          isFirst={idx === 0}
          isLast={idx === messages.length - 1}
        />
      ))}
    </div>
  );
};


// Компонент сообщения
export const Message = ({ message, isOwn, isFirst, isLast }) => {
  return (
    <div className={cn("flex flex-col", isOwn ? "items-end" : "items-start")}>
      <div
        className={cn(
          "max-w-[80%] sm:max-w-[70%] rounded-[1rem] px-5 py-3 border border-white/5",
          isOwn
            ? "bg-golden text-white"
            : "bg-[#131313] text-white",
          isFirst && !isOwn && "rounded-tl-sm",
          isLast && !isOwn && "rounded-bl-sm",
          isFirst && isOwn && "rounded-tr-sm",
          isLast && isOwn && "rounded-br-sm",
        )}
      >
        <p className="text-[0.875rem] sm:text-[1rem] break-words sm:pr-8">
          {message.text}
        </p>
        <span className={cn("italic block text-[0.6875rem] mt-1 text-right",
            isOwn
            ? "text-white"
            : "text-[#4c4c4c]",
            )
        }>
          {message.time}
        </span>
      </div>
    </div>
  );
};