"use client";

import  "./style.css";
import { useState, useEffect, use } from "react";
import axios from "axios";
import Modal from "@/app/_components/ui-elements/helper/Modal";
import InputForm from "@/app/_components/ui-elements/helper/InputForm";
import Image from "next/image";
import { useHelper } from "@/app/_features/helper/HelperContext";
import type { MouseEvent } from "react";
import { useSession } from "next-auth/react";

interface CharacterResponse {
  name: string;
  response: string;
}

export default function decisionHelperFirstInput () {
  const [ remainingChars, setRemainingChars ] = useState<number>(50);
  const [ isComing , setIsComing ] = useState<boolean>(false);
  const [ isLoading , setIsLoading ] = useState<boolean>(false);
  const [ alertFlag , setAlertFlag ] = useState<boolean>(false);
  const [ resultFlag , setResultFlag ] = useState<boolean>(false);
  const [ character1Response, setCharacter1Response ] = useState<CharacterResponse>({ name: '', response: '' });
  const [ character2Response, setCharacter2Response ] = useState<CharacterResponse>({ name: '', response: '' });
  const [ responseFlag, setResponseFlag ] = useState<boolean>(false);
  const { inputText, setInputText } = useHelper();
  const { data: session, status } = useSession();
  const maxChars = 50;

  const [ errorFlag, setErrorFlag ] = useState<boolean>(false);
  const [ errorMessage, setErrorMessage ] = useState<string>('');

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

  const parseResponse = (data: any) => {
    try {
      const parsed = JSON.parse(data.choices[0].message.content);
      setCharacter1Response({ name: parsed.character1.character1_name, response: parsed.character1.character1_response });
      setCharacter2Response({ name: parsed.character2.character2_name, response: parsed.character2.character2_response });
      setResponseFlag(true);
    } catch (e) {
      console.error("Error parsing response data", e);
      setErrorFlag(true);
      setErrorMessage("レスポンスデータの解析中にエラーが発生しました。");
    }
  }

  {/* テキストを送信する */}
  const sendText = async (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();

    const sendURL = `${process.env.NEXT_PUBLIC_API_URL}/helper/api/callback`;
    if (!inputText) {
      alert('テキストを入力してください。');
      return;
    }

    const token = session?.appAccessToken;

    setIsLoading(true);
    setResultFlag(true);

    try {
      const userCreateResponse = await axios({
        method: 'post',
        url: sendURL,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Authorization': `Bearer ${token}`
        },
        data: { inputText },
        withCredentials: true,
      });
      parseResponse(userCreateResponse.data.response);

      setTimeout(() => {
        setIsLoading(false);
      }, 1000);

      console.log(userCreateResponse.data);

    } catch (error: any) {
      console.error(error);
      setErrorFlag(true);
      setErrorMessage(error.message);
      //alert('エラーが発生しました。');
    }
  }

  return (
    <>
      {/* 機能説明画面 */}
      {/* モーダルを表示 */}
      { !isComing && !resultFlag && <Modal onClose={closeModal} />}
      {/* 2回目以降訪れたとき */}
      { isComing && !resultFlag && (
        <div className="flex flex-col items-center">
          <div className="container my-10 py-10 border-gray-300 border-1 flex flex-col items-center justify-center">
            <div className="w-full flex flex-col items-center justify-center">
              {/* 文字数オーバーの警告 */}
              { alertFlag && ( <div className="text-xl" style={{color: 'red'}}>文字数がオーバーしています。入力する悩みごとは<span className="underline">50文字以内</span>にしてください。</div> )}
              {/* 入力フォーム */}
              <InputForm
                isLoading={isLoading}
              />
              <div className="w-full flex items-center justify-end">
                <div className="flex flex-col items-center justify-center">
                  <Image src="/images/helper/man.png"
                         alt="avatar"
                         width={200}
                         height={200}
                         className="rounded-full bg-white" />
                </div>
              </div>
            </div>
          </div>
          <div>
            <button className="btn btn-sm" onClick={sendText}>Tiny</button>
          </div>
        </div>
      )}
      {/* 結果表示ウインドウ */}
      { resultFlag && (
        <div className="container my-10 flex flex-col items-center justify-center">
          <div className="w-full flex flex-col items-center justify-center">
            <div className="text-xl">結果表示</div>
            {errorFlag && (
              <div className="text-xl" style={{color: 'red'}}>{errorMessage}</div>
            )}
            { responseFlag && (
              <div>
                <div>{ character1Response.name }: { character1Response.response }</div>
                <div>{ character2Response.name }: { character2Response.response }</div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}