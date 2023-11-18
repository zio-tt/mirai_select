"use client";

import React from "react";
import Image from "next/image";
import type { JSX, MouseEvent } from 'react';
import { set } from "zod";

export default function TopPageLayout() {
  const [ imageURL, setImageURL ] = React.useState<string>("/images/top/sample1.jpeg");

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    const key = event.currentTarget.getAttribute('data-key');
    const helperText = document.querySelector('.helperText');

    if (key === "talk") {
      setImageURL("/images/top/sample1.jpeg");
      helperText!.innerHTML = "1. あなたの悩みごとを入力";
    } else if (key === "discussion") {
      setImageURL("/images/top/sample2.webp");
      helperText!.innerHTML = "2. AIが悩みごとを分析";
    } else if (key === "happy") {
      setImageURL("/images/top/sample3.jpeg");
      helperText!.innerHTML = "3. あなたの決断をサポート";
    }
  };

  return (
    <div className="flex flex-col items-center justify-start pt-16 min-h-screen w-screen bg-white">
      <div className="w-[80%] flex flex-col items-center justify-center">
        {/* 1段目のコンテンツ */}
        <div className="flex flex-row items-center justify-center mb-10"> {/* mb-10 は下のマージン */}
          {/* 左側のテキストとボタン */}
          <div className="flex flex-col items-center justify-center mr-20">
            <div className="text-center min-w-[50%] lg:text-left">
              <h1 className="text-2xl font-bold underline overflow-hidden"><span className="text-3xl text-blue-500">決断ヘルパー機能</span>であなたの決断をサポート</h1>
              <div className="py-6 text-bs font-bold overflow-hidden">
                <p>2人のキャラクターがそれぞれの視点に立ってあなたの悩みごとに対する選択肢を提示します。</p>
                <p>会話にはタグをつけて、「みんなの悩みごと」で公開することができます。</p>
                <p>今後、キャラクターカスタマイズ機能を追加予定！</p>
              </div>
              <p>各アイコンをクリックして画像を表示</p>
              <div className="flex w-[80%] p-3 border-2 border-black rounded-lg items-center justify-center">
                <a href="#" onClick={handleClick} data-key="talk"><Image src="/images/talk.png" alt="Talk" width={100} height={100} /></a>
                <Image src="/images/arrow.png" alt="Arrow" width={80} height={80} />
                <a href="#" onClick={handleClick} data-key="discussion"><div>
                  <Image src="/images/discussion.png" alt="Discussion" width={80} height={80} />
                  <Image src="/images/pc.png" alt="PC" width={80} height={80} />
                </div></a>
                <Image src="/images/arrow.png" alt="Arrow" width={80} height={80} />
                <a href="#" onClick={handleClick} data-key="happy"><Image src="/images/happy.png" alt="Happy" width={100} height={100} /></a>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="relative max-w-[100%] w-[500px] h-[400px]">
              <Image src={imageURL} className="border-2 border-gray-600" alt="Image" layout="fill" />
            </div>
            <div className="helperText underline text-lg text-center mt-3">1. あなたの悩み事を入力</div>
          </div>
        </div>
        <div className="flex flex-row items-center justify-center mt-10 mb-20">
          <div className="flex flex-col mr-20">
            <div className="relative max-w-[100%] w-[500px] h-[400px]">
              <Image src={imageURL} className="border-2 border-gray-600" alt="Image" layout="fill" />
            </div>
            <div className="helperText underline text-lg text-center mt-3">1. あなたの悩み事を入力</div>
          </div>
          {/* ここからテキストと画像を右寄せにしたい */}
          <div className="flex flex-col items-center justify-center">
            <div className="text-center min-w-[50%] lg:text-left">
              <h1 className="text-2xl font-bold underline overflow-hidden"><span className="text-3xl text-green-500">みんなの悩みごと</span>でさまざまな事例を共有</h1>
              <div className="py-6 text-bs font-bold overflow-hidden">
                <p>2人のキャラクターがそれぞれの視点に立ってあなたの悩みごとに対する選択肢を提示します。</p>
                <p>会話にはタグをつけて、「みんなの悩みごと」で公開することができます。</p>
                <p>今後、キャラクターカスタマイズ機能を追加予定！</p>
              </div>
              <p>各アイコンをクリックして画像を表示</p>
              <div className="flex w-[80%] p-3 border-2 border-black rounded-lg items-center justify-center">
                <a href="#" onClick={handleClick} data-key="talk"><Image src="/images/talk.png" alt="Talk" width={100} height={100} /></a>
                <Image src="/images/arrow.png" alt="Arrow" width={80} height={80} />
                <a href="#" onClick={handleClick} data-key="discussion"><div>
                  <Image src="/images/discussion.png" alt="Discussion" width={80} height={80} />
                  <Image src="/images/pc.png" alt="PC" width={80} height={80} />
                </div></a>
                <Image src="/images/arrow.png" alt="Arrow" width={80} height={80} />
                <a href="#" onClick={handleClick} data-key="happy"><Image src="/images/happy.png" alt="Happy" width={100} height={100} /></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
