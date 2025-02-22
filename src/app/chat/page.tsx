"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

declare global {
  interface Window {
    ai: {
      languageDetector: {
        capabilities(): Promise<{ capabilities: string }>;
        create(): Promise<{
          detect(
            text: string
          ): Promise<Array<{ detectedLanguage: string; confidence: number }>>;
        }>;
      };
      summarizer: {
        create(options?: {
          sharedContext?: string;
          type?: "key-points" | "tl;dr" | "teaser" | "headline";
          format?: "markdown" | "plain-text";
          length?: "short" | "medium" | "long";
          monitor?: (m: EventTarget) => void;
        }): Promise<{
          summarize(
            text: string,
            context?: { context?: string }
          ): Promise<string>;
          summarizeStreaming(text: string): ReadableStream<string>;
          ready: Promise<void>;
        }>;
        capabilities(): Promise<{ available: string }>;
      };
      translator: {
        create(options: {
          sourceLanguage: string;
          targetLanguage: string;
          monitor?: (m: EventTarget) => void;
        }): Promise<{
          translate(text: string): Promise<string>;
          ready: Promise<void>;
        }>;
        capabilities(): Promise<{
          languagePairAvailable(source: string, target: string): string;
        }>;
      };
    };
  }
}

const languageMap: Record<string, string> = {
  en: "English",
  pt: "Portuguese",
  es: "Spanish",
  ru: "Russian",
  tr: "Turkish",
  fr: "French",
};

type Message = {
  text: string;
  isUser: boolean;
  detectedLanguage?: string;
  summary?: string;
  translation?: string;
  translationFrom?: string;
  translationTo?: string;
  parentId?: number;
  processingAction?: "summarizing" | "translating";
  translationError?: string;
};

type TranslationLanguage = keyof typeof languageMap;

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedLangs, setSelectedLangs] = useState<
    Record<number, TranslationLanguage>
  >({});
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    adjustTextareaHeight();
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        150
      )}px`; // Max height = 150px
    }
  };

  const detectLanguage = async (text: string) => {
    try {
      const capabilities = await window.ai.languageDetector.capabilities();
      if (capabilities.capabilities === "no") {
        throw new Error("Language detection not available");
      }

      const detector = await window.ai.languageDetector.create();
      const results = await detector.detect(text);
      return results[0]?.detectedLanguage || "unknown";
    } catch (error) {
      setError("Language detection failed");
      console.error("Detection error:", error);
      return "unknown";
    }
  };

  const handleSummarize = async (text: string, messageIndex: number) => {
    // Update the message to show "Summarizing..." state
    setMessages((prevMessages) =>
      prevMessages.map((msg, idx) =>
        idx === messageIndex ? { ...msg, processingAction: "summarizing" } : msg
      )
    );

    try {
      const summarizer = await window.ai.summarizer.create({
        format: "markdown", // Request markdown format for better structure
        type: "key-points", // Request key points for better summarization
        length: "medium",
      });
      const summary = await summarizer.summarize(text);

      // Clear the processing state and add the summary response
      setMessages((prevMessages) => {
        // First update the original message to remove the processing state
        const updatedMessages = prevMessages.map((msg, idx) =>
          idx === messageIndex ? { ...msg, processingAction: undefined } : msg
        );
        // Then add the summary message
        return [
          ...updatedMessages,
          {
            text: summary,
            isUser: false,
            summary,
            parentId: messageIndex,
          },
        ];
      });
    } catch (error) {
      // Clear the processing state on error
      setMessages((prevMessages) =>
        prevMessages.map((msg, idx) =>
          idx === messageIndex ? { ...msg, processingAction: undefined } : msg
        )
      );
      setError("Summarization failed");
      console.error("Summarization error:", error);
    }
  };

  const handleLanguageSelect = (
    messageIdx: number,
    lang: TranslationLanguage
  ) => {
    setSelectedLangs((prev) => ({
      ...prev,
      [messageIdx]: lang,
    }));
  };

  const handleTranslate = async (
    text: string,
    sourceLanguage: string,
    targetLang: TranslationLanguage,
    messageIndex: number
  ) => {
    // Check if source and target languages are the same
    if (sourceLanguage === targetLang) {
      // Update the specific message with an error
      setMessages((prevMessages) =>
        prevMessages.map((msg, idx) =>
          idx === messageIndex
            ? { ...msg, translationError: "Same language detected" }
            : msg
        )
      );
      return;
    }

    // Clear any previous translation error
    setMessages((prevMessages) =>
      prevMessages.map((msg, idx) =>
        idx === messageIndex
          ? {
              ...msg,
              translationError: undefined,
              processingAction: "translating",
            }
          : msg
      )
    );

    try {
      const translator = await window.ai.translator.create({
        sourceLanguage: sourceLanguage,
        targetLanguage: targetLang,
      });
      const translation = await translator.translate(text);

      // Update to remove the processing state from original message
      setMessages((prevMessages) => {
        // Update the original message first
        const updatedMessages = prevMessages.map((msg, idx) =>
          idx === messageIndex ? { ...msg, processingAction: undefined } : msg
        );
        // Then add the translation message
        return [
          ...updatedMessages,
          {
            text: translation,
            isUser: false,
            translation,
            translationFrom: sourceLanguage,
            translationTo: targetLang,
            parentId: messageIndex,
          },
        ];
      });
    } catch (error) {
      // Clear the processing state on error
      setMessages((prevMessages) =>
        prevMessages.map((msg, idx) =>
          idx === messageIndex ? { ...msg, processingAction: undefined } : msg
        )
      );
      setError("Translation failed");
      console.error("Translation error:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setError("");
    const userMessage = { text: inputText, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "48px"; // Reset height after submit
    }

    try {
      const detectedLang = await detectLanguage(inputText);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { ...userMessage, detectedLanguage: detectedLang },
      ]);
    } catch (error) {
      setError("Error processing text");
      console.error("Submission error:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-5">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx}>
            {/* Main message bubble */}
            <div
              className={`flex max-w-7xl mx-auto ${
                msg.isUser ? "justify-end" : "justify-start"
              }`}
            >
              {!msg.translation && msg.isUser && !msg.summary && (
                <div
                  className={`flex flex-col p-3 items-start gap-6 rounded-[20px] bg-white max-w-[600px]`}
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

                  <div className="flex flex-col items-start gap-[15px] p-2 rounded-[12px] border border-[#EEE] w-full">
                    {msg.isUser && msg.detectedLanguage && (
                      <p className="text-sm text-[#7f7f7f] font-semibold">
                        Detected language:
                        <span className="text-[#262626]">
                          {" "}
                          {languageMap[msg.detectedLanguage] ||
                            msg.detectedLanguage}
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
                  <div className="flex flex-col p-8 rounded-md mt-2 ml-4 bg-gray-50">
                    <div className="text-sm text-gray-500">
                      Translation from{" "}
                      {languageMap[msg.translationFrom] || msg.translationFrom}{" "}
                      to {languageMap[msg.translationTo]}
                    </div>
                    <p className="text-[#262626] text-base font-medium leading-normal">
                      {msg.text}
                    </p>
                  </div>
                )}

              {msg.summary && (
                <div className="mt-2 text-gray-700 p-8 max-w-[800px] rounded-xl bg-gray-50 w-full">
                  <p className="text-sm text-gray-500 mb-3">Summary</p>
                  <p>{msg.summary}</p>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div className="mx-4 mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex max-w-[880px] h-fit rounded-[44px] bg-white items-center justify-center p-6 mx-auto gap-4 w-full">
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={handleChange}
            placeholder="Enter your text..."
            className="flex-1 p-4 px-6 border border-[#E3E3E3] hide-scrollbar bg-[#FAFAFA] w-full outline-none focus:outline-[#212121] focus:outline-[2px] focus:outline-offset-4 rounded-[28px] resize-none overflow-auto text-gray-700 text-base leading-relaxed"
            rows={1}
            style={{ minHeight: "48px", maxHeight: "150px" }}
            aria-label="Text input for AI processing"
          />
          <button
            type="submit"
            className="flex items-center gap-2.5 py-4 px-3.5 rounded-[36px] bg-[#EA8800] disabled:opacity-50"
            disabled={inputText.trim().length < 2}
            aria-label="Send message"
          >
            <Image
              src="/send.svg"
              width={20}
              height={20}
              alt=""
              aria-hidden="true"
            />
          </button>
        </div>
      </form>
    </div>
  );
}
