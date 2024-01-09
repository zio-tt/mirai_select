'use client';

import  './style.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { InputForm } from './components/InputForm';
import type { MouseEvent } from 'react';
import { useSession } from 'next-auth/react';
import { User, Character } from '@/app/_types';

import { CharacterDisplay } from './components/CharacterDisplay';
import { UserInterface } from './components/UserInterface';
import Loading from '@/app/_components/layouts/loading/layout';

import { useHelper } from '@/app/_contexts/HelperContext';

interface CharacterProps extends Character {
  avatar: string;
}
interface Error {
  message: string;
  kind: string;
}

export default function decisionHelper () {
  // ページ読み込み時に取得する情報（キャラクター情報）
  const { characterData , setCharacterData } = useHelper();
  const { userData, setUserData } = useHelper();
  const { isDrawerClick, setIsDrawerClick } = useHelper();
  const [ isCharacterData, setIsCharacterData ] = useState<boolean>(false);
  // 通信中の場合Loadingコンポーネントを表示する
  const [ isLoading , setIsLoading ] = useState<boolean>(false);
  // エラー処理
  const [ errors, setErrors ] = useState<Error[]>([]);
  const [ isError, setIsError ] = useState<boolean>(false);
  // 相談関係
  const [ responses, setResponses ] = useState<string[]>([]);
  const [ beforeConsultation, setBeforeConsultation ] = useState<string>('');
  const [ placeholder, setPlaceholder ] = useState<string>('悩みを入力してください（50文字以内）');
  const [ isResponse, setIsResponse ] = useState<boolean>(false);

  const [ resultFlag , setResultFlag ] = useState<boolean>(false);
  const [ characterDataLength, setCharacterDataLength ] = useState<number>(0);
  const { data: session, status } = useSession();

  const { inputText, setInputText } = useHelper();
  const { remainingTokens, setRemainingTokens } = useHelper();
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
      setUserData(response.data.user);
      setCharacterData(response.data.characters);
    } catch (error) {
      addErrorMessage({
        message: 'ユーザー情報の取得に失敗しました。',
        kind: 'fetch'
      });
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
      addErrorMessage({
        message: 'レスポンスデータの解析中にエラーが発生しました。',
        kind: 'parse'
      });
    }
  }

  const sendText = async (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();

    const sendURL = `${process.env.NEXT_PUBLIC_API_URL}/api/openai/v1/callback`;
    if (!inputText) {
      alert('テキストを入力してください。');
      return;
    }
    if (isError){ return; }

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
      setUserData(userCreateResponse.data.user);

    } catch (error: any) {
      addErrorMessage({
        message: error.message,
        kind: 'openai'
      });
    } finally {
      setBeforeConsultation(inputText);
      setIsResponse(true);
      setIsLoading(false);
      setPlaceholder('悩みを深掘りする場合は追加の相談文を入力してください（50文字以内）');
      setInputText('');
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value);
  }

  const AlertMessage = () => {
    return errors.map((error, index) => (
      <div key={index} role="alert" className="flex alert alert-error w-[80%] mb-[3vh]">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>{error.message}</span>
      </div>
    ));
  }

  // ページ読み込み時にバックエンドからユーザー情報を取得する
  useEffect(() => {
    setIsError(false);
    setErrors([]);
    fetchUserData();
  }, []);

  useEffect(() => {
    console.log(isDrawerClick)
    if(isDrawerClick) {
      // ページ内のすべてのstateを初期化
      setResponses([]);
      setBeforeConsultation('');
      setPlaceholder('悩みを入力してください（50文字以内）');
      setIsResponse(false);
      setInputText('');
      setIsLoading(false);
      setResultFlag(false);
      setCharacterDataLength(0);
      setIsDrawerClick(false);
    }
  }, [isDrawerClick]);

  // エラーメッセージをエラー配列に追加する関数
  const addErrorMessage = ({ message, kind } : Error) => {
    // 既に同じ種類のエラーが存在する場合、エラーを上書きする
    const error = errors.find(error => error.kind === kind);
    if (error) {
      error.message = message;
      return;
    }
    setErrors([...errors, {message: message, kind: kind}]);
    setIsError(true);
  }

  // エラーメッセージをエラー配列から削除する関数
  const removeErrorMessage = (kind: string) => {
    const newErrors = errors.filter(error => error.kind !== kind);
    setErrors(newErrors);
    if (newErrors.length === 0) {
      setIsError(false);
    }
  }

  // 入力フォームの内容が変更された場合の処理
  useEffect(() => {
    const inputTextLength = inputText.length;
    const remainingToken = userData ? userData.token - inputTextLength: null;

    if (inputTextLength === 0) {
      setErrors([]);
      setIsError(false);
    }

    if (userData) {
      setRemainingTokens(userData.token - inputText.length);
    }

    // 入力テキストが所持トークンを超える場合
    if (userData && remainingToken! < 0) {
      addErrorMessage({
        message: `トークン数が不足しています。（残りトークン数：${remainingToken}）`,
        kind: 'token'
      });
    } else if (userData && remainingToken! >= 0) {
      removeErrorMessage('token');
    }

    // 入力テキストが50文字を超える場合
    if (inputTextLength > 50) {
      addErrorMessage({
        message: `文字数がオーバーしています。（現在の入力文字数：${inputTextLength}/50文字）`,
        kind: 'inputText'
      });
    } else if (inputTextLength <= 50) {
      removeErrorMessage('inputText');
    }
  }, [inputText, userData]);

  useEffect(() => {
    if(!isError) {
      window.scrollTo(0, 0);
    }
  })

  // デバッグ用
  useEffect(() => {
    console.log('Updated responses:', responses);
  }, [responses]);
  useEffect(() => {
    console.log('characterData:', characterData);
    console.log('userData:', userData);
  }, [characterData, userData]);

  return (
    <>
      { !isCharacterData && <div className='w-full min-h-screen'><Loading /></div> }
      { isLoading && <div className='w-full min-h-screen'><Loading /></div> }
      { isCharacterData && !isLoading && (
        <div className='flex flex-col w-full min-h-screen items-center justify-center py-[3vh]'>
        { isError && <AlertMessage />}
          <div id='main-contents' className='w-[70vw] h-[90vh] bg-gray-200/30 rounded-md border-2 border-black shadow-lg flex flex-col items-center justify-center p-3 overflow-hidden'>
            <div className='flex flex-row w-full h-[70%]'>
              <div className='flex flex-col w-[70%] h-full border-2 rounded-md border-black justify-center items-center'>
                { isResponse && (
                  <div className='flex w-[90%] h-[10%] border-2 rounded-md border-black bg-white m-6 items-center justify-center text-black'>
                    <div className='flex'>相談内容：{beforeConsultation}</div>
                  </div>
                )}
                <CharacterDisplay
                  characters={characterData!}
                  responses={responses} />
              </div>
              <div id='control-window' className='flex flex-col w-[30%] h-full border-2 border-black ml-3 rounded-md items-center justify-end'>
                <UserInterface
                  inputText={inputText}
                  handleChange={handleChange}
                  setInputText={setInputText}
                  placeholder={placeholder}
                  sendText={sendText}
                  remainingTokens={remainingTokens}
                  resultFlag={resultFlag}
                  characterDataLength={characterDataLength} />
              </div>
            </div>
            <div id='input-form' className='w-full grow-[3] flex items-center justify-center border-2 rounded-md border-black mt-3'>
              <InputForm
                inputText={inputText}
                handleChange={handleChange}
                setInputText={setInputText}
                placeholder={placeholder}
                sendText={sendText} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}