"use client";

import React, { useState, useEffect } from "react";

export default function decisionHelper () {
  const [ inputText, setInputText ] = useState<string>('');
  const [ remainingChars, setRemainingChars ] = useState<number>(50);
  const maxChars = 50;

  useEffect(() => {
    setRemainingChars(maxChars - inputText.length);
  }, [inputText]);

  return (
    <>
      {/* 機能説明画面 */}
      {/* 入力画面 */}
      <div className="w-screen flex items-center justify-center">
        <div className="form-control w-full max-w-3xl">
          <input
            type="text"
            placeholder="悩み事を入力してください（最大50文字）"
            id="input_text"
            className="input input-bordered w-full max-w-full"
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
      </div>
      {/* 結果画面 */}
      <div>

      </div>
    </>
  )
}