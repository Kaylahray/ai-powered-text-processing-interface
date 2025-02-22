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
  const targetLang = selectedLangs[idx] || "en";

  return (
    <div className="flex flex-wrap gap-2">
      <div className="flex gap-2">
        <div className="sr-only" id={`language-label-${idx}`}>
          Select translation language
        </div>
        <select
          value={targetLang}
          onChange={(e) =>
            handleLanguageSelect(idx, e.target.value as TranslationLanguage)
          }
          className="border rounded p-2 bg-[#f4f4f4]"
          disabled={msg.processingAction !== undefined}
          aria-labelledby={`language-label-${idx}`}
          aria-describedby={`language-instruction-${idx}`}
        >
          {Object.entries(languageMap).map(([code, name]) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>
        <span id={`language-instruction-${idx}`} className="sr-only">
          Selected language: {languageMap[targetLang]}
        </span>
        <button
          onClick={() =>
            handleTranslate(
              msg.text,
              msg.detectedLanguage || "unknown",
              targetLang,
              idx
            )
          }
          className="flex w-[121px] p-[10px_12px] text-white text-sm font-semibold leading-none justify-center items-center gap-[10px] rounded-[10px] bg-[#EA8800] disabled:opacity-50"
          disabled={msg.processingAction !== undefined}
          aria-label={`Translate to ${languageMap[targetLang]}`}
          aria-busy={msg.processingAction === "translating"}
        >
          {msg.processingAction === "translating"
            ? "Translating..."
            : "Translate"}
        </button>
      </div>
    </div>
  );
};

export default LanguageSelector;
