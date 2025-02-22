import React from "react";
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
    <div
      key={idx}
      className="w-full max-w-4xl mx-auto"
      role="listitem" // Added for screen reader semantics
      aria-live="polite" // Announces updates to assistive tech
    >
      <div className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}>
        {!msg.translation && msg.isUser && !msg.summary && (
          <div
            className={`flex flex-col p-3 items-start gap-6 rounded-[20px] bg-white max-w-[600px]`}
            aria-labelledby={`message-${idx}-text`} // Associates content with label
          >
            <p
              className="text-[#262626] text-base font-medium leading-normal"
              id={`message-${idx}-text`} // ID for aria-labelledby
              aria-label={msg.isUser ? "Your message" : "AI response"} // Context for screen readers
            >
              {msg.text}
            </p>
            {msg.text.length > 150 && msg.detectedLanguage === "en" && (
              <button
                onClick={() => handleSummarize(msg.text, idx)}
                className="rounded-lg border border-[#EA8800] px-3 py-2 text-[#EA8800] text-sm font-semibold leading-none disabled:opacity-50"
                disabled={msg.processingAction !== undefined}
                aria-label={`Summarize this ${msg.text.length}-character text`} // Action description
                aria-busy={msg.processingAction === "summarizing"} // Loading state
              >
                {msg.processingAction === "summarizing"
                  ? "Summarizing..."
                  : "Summarize"}
              </button>
            )}

            <div className="flex flex-col items-start gap-[15px] p-2 rounded-[12px] border border-[#EEE]">
              {msg.isUser && msg.detectedLanguage && (
                <p
                  className="text-sm text-[#7f7f7f] font-semibold"
                  aria-label="Detected language" // Context for screen readers
                >
                  Detected language:
                  <span className="text-[#262626]">
                    {" "}
                    {languageMap[msg.detectedLanguage] || msg.detectedLanguage}
                  </span>
                </p>
              )}

              {msg.translationError && (
                <p
                  className="text-sm text-red-500 mt-1"
                  role="alert" // Important for error visibility
                  aria-live="assertive" // Forces immediate announcement
                >
                  {msg.translationError}
                </p>
              )}

              {msg.isUser && (
                <div
                  className="flex flex-wrap gap-2"
                  role="group" // Groups related controls
                  aria-labelledby={`translation-controls-${idx}`} // Group label
                >
                  <span id={`translation-controls-${idx}`} className="sr-only">
                    Translation controls for message {idx + 1}
                  </span>
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
                      aria-label="Select target language" // Clear purpose
                      aria-describedby={`selected-lang-${idx}`} // Current selection
                    >
                      {Object.entries(languageMap).map(([code, name]) => (
                        <option key={code} value={code}>
                          {name}
                        </option>
                      ))}
                    </select>
                    <span id={`selected-lang-${idx}`} className="sr-only">
                      Selected language:{" "}
                      {languageMap[selectedLangs[idx] || "en"]}
                    </span>
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
                      aria-label={`Translate to ${
                        languageMap[selectedLangs[idx] || "en"]
                      }`} // Clear action
                      aria-busy={msg.processingAction === "translating"} // Loading state
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
            <div
              className="flex flex-col mt-2 p-4 max-w-[600px] rounded-md bg-orange-50 opacity-0.5"
              aria-label="Translation result" // Context for screen readers
            >
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
          <div
            className="mt-2 text-gray-700 p-4 max-w-[600px] rounded-lg border-2 border-[#fff] w-full"
            aria-live="polite" // Announces summary updates
          >
            <p className="text-sm text-gray-500 mb-3">Summary</p>
            <p>{msg.summary}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
