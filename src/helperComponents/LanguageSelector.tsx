import React from "react";
import { Message, TranslationLanguage } from "@/types";

interface LanguageSelectorProps {
  idx: number;
  selectedLangs: Record<number, TranslationLanguage>;
  handleLanguageSelect: (messageIdx: number, lang: TranslationLanguage) => void;
  handleTranslate: (
    text: string,
    sourceLanguage: string,
    targetLang: TranslationLanguage,
    messageIndex: number
  ) => Promise<void>;
  msg: Message;
  languageMap: Record<string, string>;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  idx,
  selectedLangs,
  handleLanguageSelect,
  handleTranslate,
  msg,
  languageMap,
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      <div className="flex gap-2">
        <select
          value={selectedLangs[idx] || "en"}
          onChange={(e) => handleLanguageSelect(idx, e.target.value as TranslationLanguage)}
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
          {msg.processingAction === "translating" ? "Translating..." : "Translate"}
        </button>
      </div>
    </div>
  );
};

export default LanguageSelector;