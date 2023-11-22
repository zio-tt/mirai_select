"use client";

import  "./style.css";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import Modal from "@/app/_components/ui-elements/helper/Modal";
import InputForm from "@/app/_components/ui-elements/helper/InputForm";

export default function decisionHelperFirstInput () {
  const [ inputText, setInputText ] = useState<string>('');
  const [ remainingChars, setRemainingChars ] = useState<number>(50);
  const [ isComing , setIsComing ] = useState<boolean>(false);
  const [ isLoading , setIsLoading ] = useState<boolean>(false);
  const [ alertFlag , setAlertFlag ] = useState<boolean>(false);
  const [ resultFlag , setResultFlag ] = useState<boolean>(false);
  const router = useRouter();
  const maxChars = 50;

  {/* 入力できるテキストを50文字以下とする */}
  useEffect(() => {
    setRemainingChars(maxChars - inputText.length);
    if (inputText.length > maxChars) {
      setAlertFlag(true);
    } else {
      setAlertFlag(false);
    }
    if (inputText.length > 0) {
      sessionStorage.setItem('firstHelperInputText', inputText);
    }
  }, [inputText]);

  {/* 入力している情報を保持する */}
  useEffect(() => {
    const storedInputText = sessionStorage.getItem('firstHelperInputText');
    if (storedInputText) {
      setInputText(storedInputText);
    }
  }, []);

  {/* ページに訪れたのが初回か2回目以降かを判定する */}
  useEffect(() => {
    const storedIsComing = sessionStorage.getItem('firstHelperIsComing');
    if (!storedIsComing) {
      setIsComing(false);
    } else {
      setIsComing(true);
    }
  }, []);

  {/* 初回アクセス時の操作説明モーダルを閉じたとき、2回目以降のフラグを立てる */}
  function closeModal() {
    setIsComing(true);
    sessionStorage.setItem('firstHelperIsComing', 'true');
  }

  async function sendText() {
    if (!inputText) {
      alert('テキストを入力してください。');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/helper`, {
        text: inputText,
      });

      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error(error);
      alert('エラーが発生しました。');
    }
  }

  return (
    <>
      {/* 機能説明画面 */}
      {/* モーダルを表示 */}
      {!isComing && !resultFlag && <Modal onClose={closeModal} />}
      {/* 2回目以降訪れたとき */}
      { isComing && !resultFlag && (
        <div className="w-screen flex flex-col items-center justify-center">
          {/* タイトル */}
          <div className="text-3xl">悩みごと</div>
          {/* 文字数オーバーの警告 */}
          { alertFlag && ( <div className="text-xl" style={{color: 'red'}}>文字数がオーバーしています。入力する悩みごとは<span className="underline">50文字以内</span>にしてください。</div> )}
          {/* 入力された文字を表示するウインドウ */}
          <div className="text-window w-[60%] h-[10%]  mt-2 mb-8 relative py-2 px-6 border-t-2 border-b-2 border-black flex items-center justify-center">
            <p className="text-xl">{ inputText }</p>
          </div>
          {/* 入力フォーム */}
          <InputForm 
            inputText={inputText}
            onInputChange={(e) => setInputText(e.target.value)}
            remainingChars={remainingChars}
            onSubmit={sendText}
            isLoading={isLoading}
          />
        </div>
      )}
    </>
  )
}