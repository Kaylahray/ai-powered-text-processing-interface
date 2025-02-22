import { TranslationLanguage } from "@/types";

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

export const languageMap: Record<string, string> = {
  en: "English",
  pt: "Portuguese",
  es: "Spanish",
  ru: "Russian",
  tr: "Turkish",
  fr: "French",
};

export const detectLanguage = async (text: string): Promise<string> => {
  try {
    const capabilities = await window.ai.languageDetector.capabilities();
    if (capabilities.capabilities === "no") {
      throw new Error("Language detection not available");
    }

    const detector = await window.ai.languageDetector.create();
    const results = await detector.detect(text);
    return results[0]?.detectedLanguage || "unknown";
  } catch (error) {
    console.error("Detection error:", error);
    return "unknown";
  }
};

export const summarizeText = async (text: string): Promise<string> => {
  const summarizer = await window.ai.summarizer.create({
    format: "markdown",
    type: "key-points",
    length: "medium",
  });
  return await summarizer.summarize(text);
};

export const translateText = async (
  text: string,
  sourceLanguage: string,
  targetLanguage: TranslationLanguage
): Promise<string> => {
  const translator = await window.ai.translator.create({
    sourceLanguage: sourceLanguage,
    targetLanguage: targetLanguage,
  });
  return await translator.translate(text);
};
