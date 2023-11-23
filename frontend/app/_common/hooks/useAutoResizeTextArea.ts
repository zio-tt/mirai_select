import { useEffect, useRef, useState } from "react";

export const useAutoResizeTextArea = (initialValue: string = "") => {
  const [value, setValue] = useState(initialValue);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textArea = textAreaRef.current;
    if (textArea) {
      textArea.style.height = 'auto'; // テキストエリアの高さをリセット
      textArea.style.height = `${textArea.scrollHeight}px`; // 新しい高さを設定
    }
  }, [value]);

  return {
    value,
    setValue,
    textAreaRef,
  };
};