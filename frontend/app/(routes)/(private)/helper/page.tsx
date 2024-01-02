'use client';

import  './style.css';
import { useState, useEffect, use } from 'react';
import axios from 'axios';
import { InputForm } from './components/InputForm';
import Image from 'next/image';
import { useHelper } from '@/app/_contexts/HelperContext';
import type { MouseEvent } from 'react';
import { useSession } from 'next-auth/react';
import { User, Character } from '@/app/_types';

import { CharacterDisplay } from './components/CharacterDisplay';
import { UserInterface } from './components/UserInterface';
import { ResponseData } from './type/ResponseData';
import { set } from 'zod';
import Loading from '@/app/_components/layouts/loading/layout';


interface CharacterProps extends Character {
  avatar: string;
}

interface UserData {
  user: User;
  characters: CharacterProps[];
}

export default function decisionHelper () {
  // ページ読み込み時に取得する情報（キャラクター情報）
  const [ characterData , setCharacterData ] = useState<UserData>();
  const [ isCharacterData, setIsCharacterData ] = useState<boolean>(false);
  // レスポンスがあるかどうか
  const [ isLoading , setIsLoading ] = useState<boolean>(false);
  const [ resultFlag , setResultFlag ] = useState<boolean>(false);
  const [ errorFlag, setErrorFlag ] = useState<boolean>(false);
  const [ errorMessage, setErrorMessage ] = useState<string>('');
  const [ characterDataLength, setCharacterDataLength ] = useState<number>(0);
  const [ responses, setResponses ] = useState<ResponseData[]>([]);
  const { data: session, status } = useSession();
  const [ inputText, setInputText ] = useState<string>('');
  const [ inputTextLength, setInputTextLength ] = useState<number>(0);
  const token = session?.appAccessToken;

  // 非同期でバックエンドからユーザー情報を取得する関数
  const fetchUserData = async () => {
    try {
      const response = await axios({
        method: 'post',
        url: `${process.env.NEXT_PUBLIC_API_URL}/helper/`,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true,
      });
      setCharacterData(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      // 成功でも失敗でも実行される処理
      setIsCharacterData(true);
    }
  }

  const parseResponse = (data: any) => {
    try {
      const parsed = JSON.parse(data.choices[0].message.content);
      setResponses([parsed.character1.character1_response, parsed.character2.character2_response ]);
    } catch (e) {
      console.error('Error parsing response data', e);
      setErrorFlag(true);
      setErrorMessage('レスポンスデータの解析中にエラーが発生しました。');
    }
  }

  const sendText = async (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();

    const sendURL = `${process.env.NEXT_PUBLIC_API_URL}/api/openai/v1/callback`;
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

  // ページ読み込み時にバックエンドからユーザー情報を取得する
  useEffect(() => {
    fetchUserData();
  }, []);

  // デバッグ用
  useEffect(() => {
    console.log('Updated responses:', responses);
  }, [responses]);

  return (
    <>
      { !isCharacterData && <Loading /> }
      { isCharacterData && (
        <div className='flex w-full min-h-screen items-center justify-center'>
          <div id='main-contents' className='w-[80%] h-[95vh] bg-gray-200/30 rounded-md border-2 border-black shadow-lg flex flex-row items-center justify-center p-4 overflow-hidden'>
            <div id='decision-window' className='flex w-[70%] h-[50%] m-3 items-center justify-self-center'>
              <div className='flex flex-col w-full h-full items-center justify-center'>
                <CharacterDisplay
                  characters={characterData!.characters}
                  responses={responses} />
                <InputForm
                  inputText={inputText}
                  setInputText={setInputText} />
              </div>
            </div>
            <div id='control-window' className='flex flex-col w-[30%] h-[90%] border-2 border-black m-3'>
                <div id='send-button' className='flex'>
                  <button className='btn btn-sm bg-white text-base' onClick={sendText}>送信</button>
                </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}