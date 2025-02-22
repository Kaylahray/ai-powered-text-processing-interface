import React from "react";
import MessageBubble from "./MessageBubble";
import { Message, TranslationLanguage } from "@/types";

interface MessagesListProps {
  messages: Message[];
  handleSummarize: (text: string, messageIndex: number) => Promise<void>;
  handleTranslate: (
    text: string,
    sourceLanguage: string,
    targetLang: TranslationLanguage,
    messageIndex: number
  ) => Promise<void>;
  selectedLangs: Record<number, TranslationLanguage>;
  handleLanguageSelect: (messageIdx: number, lang: TranslationLanguage) => void;
  languageMap: Record<string, string>;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

const MessagesList: React.FC<MessagesListProps> = ({
  messages,
  handleSummarize,
  handleTranslate,
  selectedLangs,
  handleLanguageSelect,
  languageMap,
  messagesEndRef,
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-1 space-y-4">
      {messages.map((msg, idx) => (
        <MessageBubble
          key={idx}
          msg={msg}
          handleSummarize={handleSummarize}
          handleTranslate={handleTranslate}
          selectedLangs={selectedLangs}
          handleLanguageSelect={handleLanguageSelect}
          languageMap={languageMap}
          idx={idx}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessagesList;