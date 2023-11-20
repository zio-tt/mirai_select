"use client";

import  "./style.css";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { MouseEvent } from "react";

export default function decisionHelperFirstInput () {
  const [ inputText, setInputText ] = useState<string>('');
  const [ remainingChars, setRemainingChars ] = useState<number>(50);
  const [ isLoading , setIsLoading ] = useState<boolean>(false);
  const [ alertFlag , setAlertFlag ] = useState<boolean>(false);
  const maxChars = 50;

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

  useEffect(() => {
    const storedInputText = sessionStorage.getItem('firstHelperInputText');
    if (storedInputText) {
      setInputText(storedInputText);
    }
  }, []);


  function sendText(MouseEvent: MouseEvent<HTMLElement>) {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }

  return (
    <>
    {/* 機能説明画面 */}
    {/* 入力画面 */}
      <div className="w-screen flex flex-col items-center justify-center">
      {/* タイトル */}
        <div className="text-3xl">悩みごと</div>
      {/* 警告文 */}
        { alertFlag && ( <div className="text-xl" style={{color: 'red'}}>文字数がオーバーしています。入力する悩みごとは<span className="underline">50文字以内</span>にしてください。</div> )}
      {/* 入力された文字列 */}
        <div className="text-window w-[60%] h-[10%]  mt-2 mb-8 relative py-2 px-6 border-t-2 border-b-2 border-black flex items-center justify-center"><p className="text-xl">{ inputText }</p></div>
      {/* 入力フォーム */}
        <div className="flex flex-row w-screen items-center justify-center">
          <div className="form-control w-full max-w-lg">
            <input
              type="text"
              placeholder="悩みごとを入力してください（最大50文字）"
              id="input_text"
              className="input input-bordered border-black w-full max-w-full"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <label
              className="label text-sm text-base-100"
              id="char_counter"
              style={{ color: remainingChars < 0 ? 'red' : 'black' }}
            >
              残り{remainingChars}文字
            </label>
          </div>
        {/* 入力後0.5秒程度ローディングボタン */}
          { remainingChars >= 0 && (
            <div className="h-full items-start justify-start ml-4">
              { !isLoading && ( <Link href="#" onClick={sendText}><button className="btn btn-outline">Send</button></Link> )}
              { isLoading && (
                <button className="btn btn-outline">
                  <span className="loading loading-spinner"></span>
                  loading
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      {/* 結果画面 */}
      <div>

      </div>
    </>
  )
}