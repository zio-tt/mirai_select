import { useEffect, useRef, useState } from "react";
import { useHelper } from "@/app/_contexts/HelperContext";

export const useAutoResizeTextArea = (initialValue: string = "") => {
  const { inputText, setInputText } = useHelper();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textArea = textAreaRef.current;
    if (textArea) {
      textArea.style.height = 'auto'; // テキストエリアの高さをリセット
      textArea.style.height = `${textArea.scrollHeight}px`; // 新しい高さを設定
    }
  }, [inputText]);

  return {
    inputText,
    setInputText,
    textAreaRef,
  };
};