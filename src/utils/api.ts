
export type TranslationLanguage = "en" | "pt" | "es" | "ru" | "tr" | "fr";

export const detectLanguage = async (text: string) => {
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
    throw new Error("Language detection failed");
  }
};

export const summarizeText = async (text: string) => {
  try {
    const summarizer = await window.ai.summarizer.create();
    return await summarizer.summarize(text);
  } catch (error) {
    console.error("Summarization error:", error);
    throw new Error("Summarization failed");
  }
};

export const translateText = async (text: string, targetLang: TranslationLanguage, sourceLang: string) => {
  try {
    const translator = await window.ai.translator.create({
      sourceLanguage: sourceLang,
      targetLanguage: targetLang,
    });
    return await translator.translate(text);
  } catch (error) {
    console.error("Translation error:", error);
    throw new Error("Translation failed");
  }
};