"use client";

import  "./style.css";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Modal from "@/app/_components/ui-elements/helper/Modal";
import InputForm from "@/app/_components/ui-elements/helper/InputForm";
import Image from "next/image";

export default function decisionHelperFirstInput () {
  const [ inputText, setInputText ] = useState<string>('');
  const [ remainingChars, setRemainingChars ] = useState<number>(50);
  const [ isComing , setIsComing ] = useState<boolean>(false);
  const [ isLoading , setIsLoading ] = useState<boolean>(false);
  const [ alertFlag , setAlertFlag ] = useState<boolean>(false);
  const [ resultFlag , setResultFlag ] = useState<boolean>(false);
  const [ avatarURL , setAvatarURL ] = useState<string>('/images/helper/man.png');
  const maxChars = 50;

  {/* 入力できるテキストを50文字以下とする */}
  useEffect(() => {
    setRemainingChars(maxChars - inputText.length);
    if (inputText.length > maxChars) {
      setAlertFlag(true);
    } else {
      setAlertFlag(false);
    }
  }, []);

  {/* 入力している情報を保持する */}
  useEffect(() => {
    const storedInputText = sessionStorage.getItem('firstHelperInputText');
    if (storedInputText) {
      setInputText(storedInputText);
    }
  }, [inputText]);

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

  {/* アバターを切り替える */}
  function toggleAvatar() {
    if (avatarURL == '/images/helper/man.png') {
      setAvatarURL('/images/helper/woman.png')
    } else {
      setAvatarURL('/images/helper/man.png')
    }
  }

  {/* テキストを送信する */}
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
        <div className="w-screen h-screen flex flex-col items-center justify-center">
          <div className="w-screen flex flex-col items-center justify-center">
            {/* 文字数オーバーの警告 */}
            { alertFlag && ( <div className="text-xl" style={{color: 'red'}}>文字数がオーバーしています。入力する悩みごとは<span className="underline">50文字以内</span>にしてください。</div> )}
            {/* 入力フォーム */}
            <InputForm
              remainingChars={remainingChars}
              onSubmit={sendText}
              isLoading={isLoading}
            />
            <div className="w-[50%] flex items-center justify-end">
              <div className="flex flex-col items-center justify-center">
                <Image src={avatarURL} alt="avatar" width={200} height={200} />
                <input
                  type="checkbox"
                  value="synthwave"
                  onClick={toggleAvatar}
                  className="toggle theme-controller bg-amber-300 border-sky-400 [--tglbg:theme(colors.sky.500)] checked:bg-blue-300 checked:border-blue-800 checked:[--tglbg:theme(colors.blue.900)] row-start-1 col-start-1 col-span-2"/>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}