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
    if (key === "talk") {
      setImageURL("/images/top/sample1.jpeg");
    } else if (key === "discussion") {
      setImageURL("/images/top/sample2.webp");
    } else if (key === "happy") {
      setImageURL("/images/top/sample3.jpeg");
    }
  };

  return (
    <div className="flex flex-col items-center justify-start pt-16 min-h-screen w-screen bg-base-200">
      <div className="w-[80%] flex flex-col lg:flex-row items-center justify-center">
        <div className="flex flex-row items-center justify-center">

          <div className="flex flex-col items-center justify-center mr-20">
            <div className="text-center min-w-[50%] lg:text-left">
              <h1 className="text-2xl font-bold overflow-hidden"><span className="text-3xl text-blue-500">決断ヘルパー機能</span>であなたの決断をサポート</h1>
              <div className="py-6 text-bs font-bold overflow-hidden">
                <p>2人のキャラクターがそれぞれの視点に立ってあなたの悩み事に対する選択肢を提示します。</p>
                <p></p>
              </div>
              <div className="flex w-full p-3 border-2 border-black rounded-lg items-center justify-center">
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
          <Image src={imageURL} alt="Image" width={500} height={500} />
        </div>
      </div>
    </div>
  );
}
