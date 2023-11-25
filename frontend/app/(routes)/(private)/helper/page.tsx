"use client";

import  "./style.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "@/app/_components/ui-elements/helper/Modal";
import InputForm from "@/app/_components/ui-elements/helper/InputForm";
import Image from "next/image";
import { useHelper } from "@/app/_features/helper/HelperContext";

export default function decisionHelperFirstInput () {
  const [ remainingChars, setRemainingChars ] = useState<number>(50);
  const [ isComing , setIsComing ] = useState<boolean>(false);
  const [ isLoading , setIsLoading ] = useState<boolean>(false);
  const [ alertFlag , setAlertFlag ] = useState<boolean>(false);
  const [ resultFlag , setResultFlag ] = useState<boolean>(false);
  const { inputText, setInputText } = useHelper();
  const maxChars = 50;

  {/* テキスト更新時にsessionに保存する */}
  useEffect(() => {
    sessionStorage.setItem('firstHelperInputText', inputText);
  }, [inputText]);

  {/* ページ読み込み時にsessionに保存した入力情報を読み込む */}
  useEffect(() => {
    const storedInputText = sessionStorage.getItem('firstHelperInputText');
    if (storedInputText) {
      setInputText(storedInputText);
    }
  }, []);

  {/* 入力できるテキストを50文字以下とする */}
  useEffect(() => {
    setRemainingChars(maxChars - inputText.length);
    if (inputText.length > maxChars) {
      setAlertFlag(true);
    } else {
      setAlertFlag(false);
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

  {/* テキストを送信する */}
  async function sendText() {
    if (!inputText) {
      alert('テキストを入力してください。');
      return;
    }

    setIsLoading(true);
    setResultFlag(true);

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
        <div className="container my-10 flex flex-col items-center justify-center">
          <div className="w-full flex flex-col items-center justify-center">
            {/* 文字数オーバーの警告 */}
            { alertFlag && ( <div className="text-xl" style={{color: 'red'}}>文字数がオーバーしています。入力する悩みごとは<span className="underline">50文字以内</span>にしてください。</div> )}
            {/* 入力フォーム */}
            <InputForm
              remainingChars={remainingChars}
              onSubmit={sendText}
              isLoading={isLoading}
            />
            <div className="w-full flex items-center justify-end">
              <div className="flex flex-col items-center justify-center">
                <Image src="/images/helper/man.png" alt="avatar" width={200} height={200} />
                <button className="btn btn-sm" onClick={sendText}>Tiny</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* 結果表示ウインドウ */}
      { resultFlag && (
        <div className="container my-10 flex flex-col items-center justify-center">
          <div className="w-full flex flex-col items-center justify-center">
            <div className="text-xl">結果表示</div>
          </div>
        </div>
      )}
    </>
  )
}