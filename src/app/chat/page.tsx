"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  detectLanguage,
  summarizeText,
  translateText,
  languageMap,
} from "@/services/apiService";
import { Message, TranslationLanguage } from "@/types";
import MessagesList from "@/helperComponents/Messages";
import ErrorDisplay from "@/helperComponents/ErrorDisplay";
import MessageInput from "@/helperComponents/MessageInput";

const Page = () => {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedLangs, setSelectedLangs] = useState<
    Record<number, TranslationLanguage>
  >({});
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSummarize = async (text: string, messageIndex: number) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg, idx) =>
        idx === messageIndex ? { ...msg, processingAction: "summarizing" } : msg
      )
    );

    try {
      const summary = await summarizeText(text);

      setMessages((prevMessages) => {
        const updatedMessages = prevMessages.map((msg, idx) =>
          idx === messageIndex ? { ...msg, processingAction: undefined } : msg
        );
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
    if (sourceLanguage === targetLang) {
      setMessages((prevMessages) =>
        prevMessages.map((msg, idx) =>
          idx === messageIndex
            ? { ...msg, translationError: "Same language detected" }
            : msg
        )
      );
      return;
    }

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
      const translation = await translateText(text, sourceLanguage, targetLang);

      setMessages((prevMessages) => {
        const updatedMessages = prevMessages.map((msg, idx) =>
          idx === messageIndex ? { ...msg, processingAction: undefined } : msg
        );
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
    <div className="flex flex-col h-screen justify-between bg-gray-100 p-5">
      <MessagesList
        messages={messages}
        handleSummarize={handleSummarize}
        handleTranslate={handleTranslate}
        selectedLangs={selectedLangs}
        handleLanguageSelect={handleLanguageSelect}
        languageMap={languageMap}
        messagesEndRef={messagesEndRef}
      />

      <ErrorDisplay error={error} />
      <MessageInput
        inputText={inputText}
        setInputText={setInputText}
        handleSubmit={handleSubmit}
        textareaRef={textareaRef}
      />
    </div>
  );
};

export default Page;
