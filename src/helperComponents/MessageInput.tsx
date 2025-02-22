import React from "react";
import Image from "next/image";

interface MessageInputProps {
  inputText: string;
  setInputText: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}

const MessageInput: React.FC<MessageInputProps> = ({
  inputText,
  setInputText,
  handleSubmit,
  textareaRef,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    adjustTextareaHeight();
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        150
      )}px`;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex max-w-[880px] h-fit rounded-md lg:rounded-[44px] bg-white items-center justify-center p-2 lg:p-6 mx-auto gap-4 w-full">
        <textarea
          ref={textareaRef}
          value={inputText}
          onChange={handleChange}
          placeholder="Enter your text..."
          className="flex-1 p-4 px-6 border border-[#E3E3E3] hide-scrollbar bg-[#FAFAFA] w-full outline-none focus:outline-[#212121] focus:outline-[2px] focus:outline-offset-4 rounded-[30px] resize-none overflow-auto text-gray-700 text-base "
          rows={1}
          style={{ minHeight: "48px", maxHeight: "150px" }}
          aria-label="Text input for AI processing"
        />
        <button
          type="submit"
          className="flex items-center gap-2.5 p-2 lg:py-4 lg:px-3.5 rounded-[36px] bg-[#EA8800] disabled:opacity-50"
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
  );
};

export default MessageInput;
