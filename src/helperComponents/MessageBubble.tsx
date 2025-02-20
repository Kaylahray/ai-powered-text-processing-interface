// import { Message, TranslationLanguage } from "../types";
import { LoadingSpinner } from "./LoadingSpinner";
export type Message = {
    text: string;
    isUser: boolean;
    detectedLanguage?: string;
    summary?: string;
    translation?: string;
  };
  
  export type TranslationLanguage = "en" | "pt" | "es" | "ru" | "tr" | "fr";
interface MessageBubbleProps {
  message: Message;
  onSummarize: (text: string) => Promise<void>;
  onTranslate: (text: string, lang: TranslationLanguage) => Promise<void>;
  isProcessing: boolean;
  selectedLang: TranslationLanguage;
  setSelectedLang: (lang: TranslationLanguage) => void;
}

export const MessageBubble = ({
  message,
  onSummarize,
  onTranslate,
  isProcessing,
  selectedLang,
  setSelectedLang,
}: MessageBubbleProps) => {
  return (
    <div
      className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
      role="article"
    >
      <div
        className={`max-w-xl p-4 rounded-lg ${
          message.isUser ? "bg-blue-500 text-white" : "bg-white shadow-md"
        }`}
      >
        <p>{message.text}</p>
        {message.detectedLanguage && (
          <p 
            className="text-sm mt-2 text-gray-500"
            aria-label={`Detected language: ${message.detectedLanguage}`}
          >
            Detected language: {message.detectedLanguage}
          </p>
        )}
        {!message.isUser && (message.summary || message.translation) && (
          <div 
            className="mt-2 p-2 bg-gray-100 rounded"
            role="region"
            aria-label="Processing results"
          >
            {message.summary && (
              <p aria-label="Summary result">Summary: {message.summary}</p>
            )}
            {message.translation && (
              <p aria-label="Translation result">Translation: {message.translation}</p>
            )}
          </div>
        )}
        {message.isUser && (
          <div className="mt-4 space-y-2">
            {message.text.length > 150 && message.detectedLanguage === "en" && (
              <button
                onClick={() => onSummarize(message.text)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 flex items-center gap-2"
                disabled={isProcessing}
                aria-busy={isProcessing}
              >
                {isProcessing && <LoadingSpinner />}
                Summarize
              </button>
            )}
            <div className="flex gap-2">
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value as TranslationLanguage)}
                className="border rounded p-2 bg-white"
                disabled={isProcessing}
                aria-label="Select target language"
              >
                {["en", "pt", "es", "ru", "tr", "fr"].map((lang) => (
                  <option key={lang} value={lang}>
                    {lang.toUpperCase()}
                  </option>
                ))}
              </select>
              <button
                onClick={() => onTranslate(message.text, selectedLang)}
                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50 flex items-center gap-2"
                disabled={isProcessing}
                aria-busy={isProcessing}
              >
                {isProcessing && <LoadingSpinner />}
                Translate
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};