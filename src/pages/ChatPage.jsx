// src/pages/ChatPage.jsx
import { useState, useRef, useEffect } from "react";
import { AdBanner } from "@/components/basic/adBanner";
import { BackTitle } from "@/components/basic/BackTitle";
import { useNavigate } from "react-router-dom";
import { lastMessagesData } from "@/components/chat/LastMessages.data";

import { MessageDay } from "@/components/chat/Messages";
import { ChatInput } from "@/components/chat/ChatInput";

export default function ChatPage({
  adBanner = {
    href: "https://example.com",
    imageSrc: null,
    title: "РЕКЛАМА",
  },
}) {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState(lastMessagesData);

  // Группировка сообщений по датам
  const groupMessagesByDate = () => {
    const groups = {};
    messages.forEach((message) => {
      const date = message.date || "07.05.2026";
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    return groups;
  };

  // Отправка нового сообщения
  const handleSendMessage = (text) => {
    const newMessage = {
      id: Date.now(),
      text: text,
      isOwn: true,
      time: new Date().toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: new Date().toLocaleDateString("ru-RU"),
    };
    setMessages((prev) => [...prev, newMessage]);

    // Имитация ответа от поддержки
    setTimeout(() => {
      const responseMessage = {
        id: Date.now() + 1,
        text: "Спасибо за обращение! Мы ответим в ближайшее время.",
        isOwn: false,
        time: new Date().toLocaleTimeString("ru-RU", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: new Date().toLocaleDateString("ru-RU"),
      };
      setMessages((prev) => [...prev, responseMessage]);
    }, 1000);
  };

  // Автоскролл к новым сообщениям
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const messagesByDate = groupMessagesByDate();

  return (
    <div className="flex flex-col h-screen">
      {/* Верхняя фиксированная часть */}
      <div className="shrink-0 pt-2 sm:pt-4 lg:pt-7.5">
        <AdBanner
          href={adBanner.href}
          title={adBanner.title}
          imageSrc={adBanner.imageSrc}
          className="mb-2 sm:mb-4 lg:mb-5"
        />

        <BackTitle
          title="Чат поддержки"
          onBack={() => navigate(-1)}
          className="mt-6 mb-4"
          titleClassName="text-[1.5rem] sm:text-[1.5rem] lg:text-[1.5rem]"
        />
      </div>

      {/* Тело чата - занимает все оставшееся пространство */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="w-full mx-auto max-w-[46.625rem] flex-1 flex flex-col min-h-0">
          {/* Область сообщений - скроллится */}
          <div className="flex-1 overflow-y-auto space-y-4 scroll-hide">
            {Object.entries(messagesByDate).map(([date, dateMessages]) => (
              <MessageDay key={date} date={date} messages={dateMessages} />
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Инпут для сообщений - прижат к низу */}
          <div className="shrink-0 -ml-4 sm:-ml-8 -mr-4 sm:-mr-8">
            <ChatInput onSendMessage={handleSendMessage} />
          </div>
        </div>
      </div>
    </div>
  );
}