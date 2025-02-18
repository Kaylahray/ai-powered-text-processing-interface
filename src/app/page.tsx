// app/page.tsx
"use client";
import { useState, useRef, useEffect } from "react";
// import { ArrowUpIcon } from "@heroicons/react/24/solid";

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

type Message = {
  text: string;
  isUser: boolean;
  detectedLanguage?: string;
  summary?: string;
  translation?: string;
};

type TranslationLanguage = "en" | "pt" | "es" | "ru" | "tr" | "fr";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedLang, setSelectedLang] = useState<TranslationLanguage>("en");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const handleSummarize = async (text: string) => {
    setIsProcessing(true);
    try {
      const summarizer = await window.ai.summarizer.create();
      const summary = await summarizer.summarize(text);
      setMessages((prev) => [
        ...prev,
        { text: summary, isUser: false, summary },
      ]);
    } catch (error) {
      setError("Summarization failed");
      console.error("Summarization error:", error);
    }
    setIsProcessing(false);
  };

  const handleTranslate = async (
    text: string,
    targetLang: TranslationLanguage
  ) => {
    setIsProcessing(true);
    try {
      const detectedLang = await detectLanguage(text);
      const translator = await window.ai.translator.create({
        sourceLanguage: detectedLang,
        targetLanguage: targetLang,
      });
      const translation = await translator.translate(text);
      setMessages((prev) => [
        ...prev,
        { text: translation, isUser: false, translation },
      ]);
    } catch (error) {
      setError("Translation failed");
      console.error("Translation error:", error);
    }
    setIsProcessing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setError("");
    const userMessage = { text: inputText, isUser: true };
    setMessages((prev) => [...prev, userMessage]);

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

    setInputText("");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xl p-4 rounded-lg ${
                msg.isUser ? "bg-blue-500 text-white" : "bg-white shadow-md"
              }`}
            >
              <p>{msg.text}</p>
              {msg.detectedLanguage && (
                <p className="text-sm mt-2 text-gray-500">
                  Detected language: {msg.detectedLanguage}
                </p>
              )}
              {!msg.isUser && (msg.summary || msg.translation) && (
                <div className="mt-2 p-2 bg-gray-100 rounded">
                  {msg.summary && <p>Summary: {msg.summary}</p>}
                  {msg.translation && <p>Translation: {msg.translation}</p>}
                </div>
              )}
              {msg.isUser && (
                <div className="mt-4 space-y-2">
                  {msg.text.length > 150 && msg.detectedLanguage === "en" && (
                    <button
                      onClick={() => handleSummarize(msg.text)}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
                      disabled={isProcessing}
                    >
                      Summarize
                    </button>
                  )}
                  <div className="flex gap-2">
                    <select
                      value={selectedLang}
                      onChange={(e) =>
                        setSelectedLang(e.target.value as TranslationLanguage)
                      }
                      className="border rounded p-2 bg-white"
                      disabled={isProcessing}
                    >
                      {["en", "pt", "es", "ru", "tr", "fr"].map((lang) => (
                        <option key={lang} value={lang}>
                          {lang.toUpperCase()}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleTranslate(msg.text, selectedLang)}
                      className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
                      disabled={isProcessing}
                    >
                      Translate
                    </button>
                  </div>
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

      <form onSubmit={handleSubmit} className="p-4 bg-white border-t">
        <div className="flex gap-2">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter your text..."
            className="flex-1 p-2 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            disabled={isProcessing}
            aria-label="Text input for AI processing"
          />
          <button
            type="submit"
            className="self-end p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors duration-200"
            disabled={isProcessing || !inputText.trim()}
            aria-label="Send message"
          >
            up
            {/* <ArrowUpIcon className="w-6 h-6" /> */}
          </button>
        </div>
      </form>
    </div>
  );
}
