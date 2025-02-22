import React from "react";
import LanguageSelector from "./LanguageSelector";
import { Message, TranslationLanguage } from "@/types";

interface MessageBubbleProps {
  msg: Message;
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
  idx: number;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  msg,
  handleSummarize,
  handleTranslate,
  selectedLangs,
  handleLanguageSelect,
  languageMap,
  idx,
}) => {
  return (
    <div key={idx} className="w-full max-w-4xl mx-auto">
      <div className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}>
        {!msg.translation && msg.isUser && !msg.summary && (
          <div
            className={`flex flex-col p-3 items-start gap-6 rounded-[20px] bg-white max-w-[600px] `}
          >
            <p className="text-[#262626] text-base font-medium leading-normal">
              {msg.text}
            </p>
            {msg.text.length > 150 && msg.detectedLanguage === "en" && (
              <button
                onClick={() => handleSummarize(msg.text, idx)}
                className="rounded-lg border border-[#EA8800] px-3 py-2 text-[#EA8800] text-sm font-semibold leading-none disabled:opacity-50"
                disabled={msg.processingAction !== undefined}
              >
                {msg.processingAction === "summarizing"
                  ? "Summarizing..."
                  : "Summarize"}
              </button>
            )}

            <div className="flex flex-col items-start gap-[15px] p-2 rounded-[12px] border border-[#EEE] ">
              {msg.isUser && msg.detectedLanguage && (
                <p className="text-sm text-[#7f7f7f] font-semibold">
                  Detected language:
                  <span className="text-[#262626]">
                    {" "}
                    {languageMap[msg.detectedLanguage] || msg.detectedLanguage}
                  </span>
                </p>
              )}

              {msg.translationError && (
                <p className="text-sm text-red-500 mt-1">
                  {msg.translationError}
                </p>
              )}

              {msg.isUser && (
                <div className="flex flex-wrap gap-2">
                  <div className="flex gap-2">
                    <select
                      value={selectedLangs[idx] || "en"}
                      onChange={(e) =>
                        handleLanguageSelect(
                          idx,
                          e.target.value as TranslationLanguage
                        )
                      }
                      className="border rounded p-2 bg-[#f4f4f4]"
                      disabled={msg.processingAction !== undefined}
                    >
                      {Object.entries(languageMap).map(([code, name]) => (
                        <option key={code} value={code}>
                          {name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() =>
                        handleTranslate(
                          msg.text,
                          msg.detectedLanguage || "unknown",
                          selectedLangs[idx] || "en",
                          idx
                        )
                      }
                      className="flex w-[121px] p-[10px_12px] text-white text-sm font-semibold leading-none justify-center items-center gap-[10px] rounded-[10px] bg-[#EA8800] disabled:opacity-50"
                      disabled={msg.processingAction !== undefined}
                    >
                      {msg.processingAction === "translating"
                        ? "Translating..."
                        : "Translate"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {!msg.isUser &&
          msg.translation &&
          msg.translationFrom &&
          msg.translationTo && (
            <div className="flex flex-col mt-2 p-4 max-w-[600px] rounded-md bg-orange-50 opacity-0.5">
              <div className="text-sm text-gray-500">
                Translation from{" "}
                {languageMap[msg.translationFrom] || msg.translationFrom} to{" "}
                {languageMap[msg.translationTo]}
              </div>
              <p className="text-[#262626] text-base font-medium leading-normal">
                {msg.text}
              </p>
            </div>
          )}

        {msg.summary && (
          <div className="mt-2 text-gray-700 p-3 max-w-[600px] rounded-lg bg-gray-50 w-full">
            <p className="text-sm text-gray-500 mb-3">Summary</p>
            <p>{msg.summary}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
