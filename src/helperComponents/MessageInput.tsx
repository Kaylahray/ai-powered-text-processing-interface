// components/MessageInput.tsx
import { ArrowUp } from "lucide-react";
import { LoadingSpinner } from "./LoadingSpinner";

interface MessageInputProps {
  inputText: string;
  setInputText: (text: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isProcessing: boolean;
}

export const MessageInput = ({
  inputText,
  setInputText,
  onSubmit,
  isProcessing,
}: MessageInputProps) => {
  return (
    <form 
      onSubmit={onSubmit} 
      className="p-4 bg-white border-t"
      role="form"
      aria-label="Message input form"
    >
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
          className="self-end p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors duration-200 flex items-center justify-center"
          disabled={isProcessing || !inputText.trim()}
          aria-label="Send message"
        >
          {isProcessing ? (
            <LoadingSpinner />
          ) : (
            <ArrowUp className="w-6 h-6" />
          )}
        </button>
      </div>
    </form>
  );
};
