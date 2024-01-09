'use client';

import  './style.css';
import axios from 'axios';
import type { MouseEvent } from 'react';

// Components
import { AlertMessage }     from './_components/AlertMessage';
import { CharacterDisplay } from './_components/Character/CharacterDisplay';
import { CheckModal }       from './_components/CheckModal';
import { InputForm }        from './_components/UserInterface/InputForm';
import { UserInterface }    from './_components/UserInterface/UserInterface';
import { Loading }          from '@/app/_components/layouts/loading/layout';
// Hooks
import { useState, useEffect } from 'react';
import { useHelper } from '@/app/_contexts/HelperContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
// Types
import { Error } from './_types/Error';
import { User, Character, Decision, Conversation } from '@/app/_types';
import { set } from 'zod';

interface CharacterProps extends Character {
  avatar: string;
}


export default function decisionHelper () {
  // ページ読み込み時に取得する情報（キャラクター情報）
  const { characterData , setCharacterData } = useHelper();
  const { userData, setUserData } = useHelper();
  const [ isCharacterData, setIsCharacterData ] = useState<boolean>(false);
  // 通信中の場合Loadingコンポーネントを表示する
  const [ isLoading , setIsLoading ] = useState<boolean>(false);
  // エラー処理
  const [ errors, setErrors ] = useState<Error[]>([]);
  const [ isError, setIsError ] = useState<boolean>(false);
  // 相談関係
  const [ responses, setResponses ] = useState<string[]>([]);
  const [ decision, setDecision ] = useState<number>(0);
  const [ conversation, setConversation ] = useState<Conversation[]>([]);
  const [ beforeConsultation, setBeforeConsultation ] = useState<string>('');
  const [ placeholder, setPlaceholder ] = useState<string>('悩みを入力してください（50文字以内）');
  const [ isResponse, setIsResponse ] = useState<boolean>(false);
  // チェックボックス関係
  // チェックボックスにチェックが入っている場合、確認用モーダルを表示しない
  const [ isCheckModal, setIsCheckModal ] = useState<boolean>(false);

  // ユーザーインターフェース関係
  const [ tags, setTags ] = useState<string[]>([]);
  const [ userDecision, setUserDecision ] = useState<number>(0);
  const [ isPublic, setIsPublic ] = useState<boolean>(false);

  const { data: session, status } = useSession();

  const { inputText, setInputText } = useHelper();
  const { remainingTokens, setRemainingTokens } = useHelper();
  const token = session?.appAccessToken;

  const router = useRouter();

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
      setDecision(userCreateResponse.data.decision);
      setConversation(userCreateResponse.data.conversation);

      console.log("userCreateResponse:",userCreateResponse.data);

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

  const saveDecision = async (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
  
    // タグが少なくとも1つ存在し、ユーザーがキャラクターを選択しているかを確認
    if (tags.length === 0 || userDecision === 0) {
      // エラーメッセージを表示
      addErrorMessage({
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
      console.log(response.data.message);
    } catch (error: any) {
      addErrorMessage({
        message: error.message,
        kind: 'openai'
      });
    } finally {
      // ページ内の状態を全てデフォルトに戻す
      initializeState();
    }
  }

  const initializeState = () => {
    setTags([]);
    setUserDecision(0);
    setIsPublic(false);
    setIsResponse(false);
    setIsLoading(false);
    setPlaceholder('悩みを入力してください（50文字以内）');
    setInputText('');
    setResponses([]);
    setDecision(0);
    setBeforeConsultation('');
    setConversation([]);

    return;
  }

  // ページ読み込み時にバックエンドからユーザー情報を取得する
  useEffect(() => {
    setIsError(false);
    setErrors([]);
    fetchUserData();
  }, []);

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

  useEffect(() => {
    if(tags.length > 0 && userDecision !== 0) {
      removeErrorMessage('validation');
    }
  }, [tags, userDecision]);

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

  return (
    <>
      { !isCharacterData && <div className='w-full min-h-screen'><Loading /></div> }
      { isLoading && <div className='w-full min-h-screen'><Loading /></div> }
      { isCharacterData && !isLoading && (
        <div className='flex flex-col w-full min-h-screen items-center justify-center py-[3vh]'>
        { isError && <AlertMessage errors={errors} />}
          <div id='main-contents' className='w-[70vw] h-[90vh] bg-gray-200/30 rounded-md border-2 border-black shadow-lg flex flex-col items-center justify-center p-3 overflow-hidden'>
            <div className='flex flex-row w-full h-[70%]'>
              <div className='flex flex-col w-[70%] h-full border-2 rounded-md border-black justify-center items-center'>
                { isResponse && (
                  <>
                    <div className='flex w-[90%] h-[10%] border-2 rounded-md border-black bg-white mx-6 mt-6 mb-2 items-center justify-center text-black'>
                      <div className='flex'>相談内容：{beforeConsultation}</div>
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
                <UserInterface
                  tags={tags}
                  setTags={setTags}
                  isPublic={isPublic}
                  setIsPublic={setIsPublic}
                  saveDecision={saveDecision}
                   />
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