export type Message = {
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
  
  export type TranslationLanguage =
    | "en"
    | "pt"
    | "es"
    | "ru"
    | "tr"
    | "fr";
  