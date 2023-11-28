"use client"

import Image from 'next/image';
import { useState, MouseEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function Home() {
  const router = useRouter();

  const [ hasVisited, setHasVisited ] = useState<boolean>(false);
  const [ helperImageURL, setHelperImageURL ] = useState<string>("/images/top/sample1.jpeg");
  const [ indexImageURL, setIndexImageURL ] = useState<string>("/images/top/sample1.jpeg");
  const [ helperText, setHelperText ] = useState<string>("1. あなたの悩みごとを入力");
  const [ indexText, setIndexText ] = useState<string>("1. あなたの悩みごとを入力");

  const switchHelper = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    const key = event.currentTarget.getAttribute('data-key');

    if (key === "helper-talk") {
      setHelperImageURL("/images/top/sample1.jpeg");
      setHelperText("1. あなたの悩みごとを入力");
    } else if (key === "helper-discussion") {
      setHelperImageURL("/images/top/sample2.webp");
      setHelperText("2. AIが悩みごとを分析");
    } else if (key === "helper-happy") {
      setHelperImageURL("/images/top/sample3.jpeg");
      setHelperText("3. あなたの決断をサポート");
    }
  };

  const switchIndex = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    const key = event.currentTarget.getAttribute('data-key');

    if (key === "index-talk") {
      setIndexImageURL("/images/top/sample1.jpeg");
      setIndexText("1. あなたの悩みごとを入力");
    } else if (key === "index-discussion") {
      setIndexImageURL("/images/top/sample2.webp");
      setIndexText("2. AIが悩みごとを分析");
    } else if (key === "index-happy") {
      setIndexImageURL("/images/top/sample3.jpeg");
      setIndexText("3. あなたの決断をサポート");
    }
  };

  useEffect(() => {

  }, []);

  return (
    <>
    {/* 2023-11-28 16:00 */}
    {/* TopPageのレイアウト変更案（レスポンシブデザイン） */}
    {/* アイコンによる画像表示をやめ、swiperなどによるスライダー実装 */}
    {/* タブレット（縦）以下の画面幅であれば画像表示と説明文を縦で表示 */}
    {/* 画像表示はvwで割合表示させる */}

      {/* ヒーローページ */}
      {/* サイトの説明とGoogle認証/体験ページへのリンク */}
      {/* 画像はPCとスマホの2種類用意 */}
      <div>

      </div>

      {/*}
      <div className="flex flex-col items-center justify-start pt-16 min-h-screen w-full bg-white">
        <div className="w-[80%] flex flex-col items-center justify-center">
          <div className="flex lg:flex-row flex-col items-center justify-center mb-10">
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
                  <a href="#" onClick={switchHelper} data-key="helper-talk"><Image src="/images/talk.png" alt="Talk" width={100} height={100} /></a>
                  <Image src="/images/arrow.png" alt="Arrow" width={80} height={80} />
                  <a href="#" onClick={switchHelper} data-key="helper-discussion"><div>
                    <Image src="/images/discussion.png" alt="Discussion" width={80} height={80} />
                    <Image src="/images/pc.png" alt="PC" width={80} height={80} />
                  </div></a>
                  <Image src="/images/arrow.png" alt="Arrow" width={80} height={80} />
                  <a href="#" onClick={switchHelper} data-key="helper-happy"><Image src="/images/happy.png" alt="Happy" width={100} height={100} /></a>
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="relative max-w-[100%] w-[30vw] h-[20vw]">
                <Image src={helperImageURL} className="border-2 border-gray-600" alt="Image" layout="fill" />
              </div>
              <div className="underline text-lg text-center mt-3">{helperText}</div>
            </div>
          </div>
          <div className="flex flex-row items-center justify-center mt-10 mb-20">
            <div className="flex flex-col mr-20">
              <div className="relative max-w-[100%] w-[500px] h-[400px]">
                <Image src={indexImageURL} className="border-2 border-gray-600 max-w-[100%] h-auto" alt="Image" layout="fill" />
              </div>
              <div className="underline text-lg text-center mt-3">{indexText}</div>
            </div>
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
                  <a href="#" onClick={switchIndex} data-key="index-talk"><Image src="/images/talk.png" alt="Talk" width={100} height={100} /></a>
                  <Image src="/images/arrow.png" alt="Arrow" width={80} height={80} />
                  <a href="#" onClick={switchIndex} data-key="index-discussion"><div>
                    <Image src="/images/discussion.png" alt="Discussion" width={80} height={80} />
                    <Image src="/images/pc.png" alt="PC" width={80} height={80} />
                  </div></a>
                  <Image src="/images/arrow.png" alt="Arrow" width={80} height={80} />
                  <a href="#" onClick={switchIndex} data-key="index-happy"><Image src="/images/happy.png" alt="Happy" width={100} height={100} /></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      */}
    </>
  );
}