'use client';

import './style.css';
import axios from 'axios';
import type { MouseEvent } from 'react';

// Components
import { AlertMessage }       from './_components/AlertMessage';
import { CharacterDisplay }   from './_components/Character/CharacterDisplay';
import { CheckModal }         from './_components/CheckModal';
import { InputForm }          from './_components/UserInterface/InputForm';
import { UserInterface }      from './_components/UserInterface/UserInterface';
import { Loading }            from '@/app/_components/layouts/loading/layout';
import { useErrorHandling }   from './_hooks/useErrorHandling';
// Hooks
import { useState, useEffect } from 'react';
import { useHelper }           from '@/app/_contexts/HelperContext';
import { useSession }          from 'next-auth/react';
// Types
import { Error } from './_types/Error';
import { Character, Conversation, Decision } from '@/app/_types';
import { set } from 'zod';

interface CharacterProps extends Character {
  avatar: string;
}

export default function decisionHelper () {
  const { data: session, status } = useSession();
  // ページ読み込み時に取得する情報（キャラクター情報）
  const { characterData , setCharacterData } = useHelper();
  const { userData, setUserData }            = useHelper();
  // ドロワーとの連携
  const { isDrawerClick, setIsDrawerClick } = useHelper();
  // 深掘り機能
  const [ beforeQueryText, setBeforeQueryText ] = useState('');
  const [ conversationCount, setConversationCount ] = useState<number>(1);
  // バックグラウンド機能（ローディング）
  const [ isLoading , setIsLoading ] = useState<boolean>(false);
  // エラー処理
  const { errors, isError, addErrorMessages, removeErrorMessages, resetErrorMessages } = useErrorHandling();
  // データ格納用
  const [ responses, setResponses ] = useState<string[]>([]);
  const [ decision, setDecision ] = useState<Decision>();
  const [ conversation, setConversation ] = useState<Conversation[]>([]);
  const [ isResponse, setIsResponse ] = useState<boolean>(false);
  // チェックボックス関係
  const [ isCheckModal, setIsCheckModal ] = useState<boolean>(false);

  // ユーザーインターフェース関係
  const [ tags, setTags ] = useState<string[]>([]);
  const [ userDecision, setUserDecision ] = useState<string>('');
  const [ isPublic, setIsPublic ] = useState<boolean>(false);
  // 入力フォーム
  const { inputText, setInputText } = useHelper();
  const [ placeholder, setPlaceholder ] = useState<string>('悩みを入力してください（50文字以内）');
  const { remainingTokens, setRemainingTokens } = useHelper();

  const token  = session?.appAccessToken;

  {/* ページ読み込み時に使用する関数 */}
  // ページ読み込み時にバックエンドからユーザー情報を取得する
  useEffect(() => {
    fetchInitData();
    resetErrorMessages();
  }, []);

  const fetchInitData = async () => {
    if (!session) return;

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
      // responseが正常に取得できた時
      if (response.status === 200) {
        setUserData(response.data.user);
        setCharacterData(response.data.characters);
        setIsLoading(false);
      }
    } catch (error) {
      addErrorMessages({
        message: 'ユーザー情報の取得に失敗しました。',
        kind: 'fetch'
      });
    }
  }

  {/* Conversation関係 */}
  const createConversation = async (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();

    const sendURL = `${process.env.NEXT_PUBLIC_API_URL}/api/openai/v1/callback`;
    const fetchData = {
      inputText,
      conversationCount,
      decisionId      : conversationCount === 1 && !decision ? null : decision!.id,
      beforeQueryText : conversationCount === 1              ? ''   : beforeQueryText,
      userDecision    : conversationCount === 1              ? null : userDecision,
      remainingTokens
    }

    if (!inputText) {
      alert('テキストを入力してください。');
      return;
    }
    if (isError){ return; }

    setIsLoading(true);

    try {
      const userCreateResponse = await axios({
        method: 'post',
        url: sendURL,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Authorization': `Bearer ${token}`
        },
        data: {fetchData},
        withCredentials: true,
      });
      if (userCreateResponse.status == 200) {
        parseResponse(userCreateResponse.data.response);

        // レスポンスデータを各Stateに格納
        setUserData(userCreateResponse.data.user);
        setDecision(userCreateResponse.data.decision);
        setConversation(userCreateResponse.data.conversation);
        // 1,2度目のConversationで共通のState
        setIsLoading(false);
        setBeforeQueryText(inputText);

        if (!isResponse) {
          setIsResponse(true);
          setPlaceholder('悩みを深掘りする場合は追加の相談文を入力してください（50文字以内）');
          setInputText('');
          setConversationCount(2);
        } else {
          setConversationCount(3);
        }
      }
    } catch (error: any) {
      addErrorMessages({
        message: error.message,
        kind: 'openai'
      });
    }
  }

  const parseResponse = (data: any) => {
    try {
      const parsed = JSON.parse(data.choices[0].message.content);
      setResponses([parsed.character1.character1_response, parsed.character2.character2_response ]);
    } catch (e) {
      addErrorMessages({
        message: 'レスポンスデータの解析中にエラーが発生しました。',
        kind: 'parse'
      });
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value);
  }

  const saveDecision = async (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
  
    // タグが少なくとも1つ存在し、ユーザーがキャラクターを選択しているかを確認
    if (tags.length === 0 || !userDecision ) {
      // エラーメッセージを表示
      addErrorMessages({
        message: '最低1つのタグを入力し、どちらかのキャラクターを選択してください。',
        kind: 'validation'
      });
      return;
    }
  
    const sendURL = `${process.env.NEXT_PUBLIC_API_URL}/api/create`;
    if (isError) return;
  
    const token = session?.appAccessToken;
  
    setIsLoading(true);
  
    try {
      const response = await axios({
        method: 'post',
        url: sendURL,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Authorization': `Bearer ${token}`
        },
        data: { tags, userDecision, isPublic, decision, conversation },
        withCredentials: true,
      });
    } catch (error: any) {
      addErrorMessages({
        message: error.message,
        kind: 'openai'
      });
    } finally {
      // ページ内の状態を全てデフォルトに戻す
      initializeState();
    }
  }

  // すべてのstateを初期化する関数
  const initializeState = () => {
    fetchInitData();
    resetErrorMessages();

    setResponses([]);
    setBeforeQueryText('');
    setPlaceholder('悩みを入力してください（50文字以内）');
    setIsResponse(false);
    setInputText('');
    setTags([]);
    setUserDecision('');
    setIsPublic(false);
    setConversationCount(1);

    return;
  }


  useEffect(() => {
    if(isDrawerClick) {
      // ページ内のすべてのstateを初期化
      initializeState();
      setIsDrawerClick(false);
    }
  }, [isDrawerClick]);


  useEffect(() => {
    if(tags.length > 0 && userDecision !== '') {
      removeErrorMessages('validation');
    }
  }, [tags, userDecision]);

  // 入力フォームの内容が変更された場合の処理
  useEffect(() => {
    const inputTextLength = inputText.length;
    // 入力フォームに何も入力されていない場合エラーをリセットする
    if (inputTextLength === 0) {resetErrorMessages()}
    // 入力フォームに入力された文字数をトークン数から引いて残りトークン数を計算する
    if (userData) {setRemainingTokens(userData.token - inputText.length)}

    // 入力テキストが50文字を超える場合
    if (inputTextLength > 50) {
      addErrorMessages({
        message: `文字数がオーバーしています。（現在の入力文字数：${inputTextLength}/50文字）`,
        kind: 'inputText'
      });
    } else if (inputTextLength <= 50) {
      removeErrorMessages('inputText');
    }
  }, [inputText, userData]);

  // 残りトークン数が0以下になった場合
  useEffect(() => {
    if (remainingTokens < 0) {
      addErrorMessages({
        message: `トークン数が不足しています。（残りトークン数：${remainingTokens}）`,
        kind: 'token'
      });
    }
  }, [remainingTokens])

  // エラーがなくなった時にスクロールをトップに戻す
  useEffect(() => {
    if(!isError) {
      window.scrollTo(0, 0);
    }
  })

  return (
    <>
      { !characterData && <div className='w-full min-h-screen'><Loading /></div> }
      { isLoading && <div className='w-full min-h-screen'><Loading /></div> }
      { characterData && !isLoading && (
        <div className='flex flex-col w-full min-h-screen items-center justify-center py-[3vh]'>
        { isError && <AlertMessage errors={errors} />}
          <div id='main-contents' className='w-[70vw] h-[90vh] bg-gray-200/30 rounded-md border-2 border-black shadow-lg flex flex-col items-center justify-center p-3 overflow-hidden'>
            <div className='flex flex-row w-full h-[70%]'>
              <div className='flex flex-col w-[70%] h-full border-2 rounded-md border-black justify-center items-center'>
                { isResponse && (
                  <>
                    <div className='flex w-[90%] h-[10%] border-2 rounded-md border-black bg-white mx-6 mt-6 mb-2 items-center justify-center text-black'>
                      <div className='flex'>相談内容：{beforeQueryText}</div>
                    </div>
                    <div className='flex w-[60%] h-[10%] rounded-xl bg-pink-200 items-center justify-center text-black'>
                      良いと思った方の意見を選択してください。
                    </div>
                  </>
                )}
                <CharacterDisplay
                  characters={characterData!}
                  responses={responses}
                  userDecision={userDecision}
                  setUserDecision={setUserDecision}
                  isResponse={isResponse} />
              </div>
              <div id='control-window' className='flex flex-col w-[30%] h-full border-2 border-black ml-3 rounded-md items-center justify-end'>
                { isResponse && <UserInterface
                  tags={tags}
                  setTags={setTags}
                  isPublic={isPublic}
                  setIsPublic={setIsPublic}
                  saveDecision={saveDecision}
                   />
                }
              </div>
            </div>
            <div id='input-form' className='w-full grow-[3] flex items-center justify-center border-2 rounded-md border-black mt-3'>
              { conversationCount != 3 && <InputForm
                inputText={inputText}
                handleChange={handleChange}
                setInputText={setInputText}
                placeholder={placeholder}
                sendText={createConversation} />
              }
            </div>
          </div>
        </div>
      )}
    </>
  );
}