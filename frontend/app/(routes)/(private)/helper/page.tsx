'use client';

import './style.css';
import axios from 'axios';

// Components
import { AlertMessage }       from './_components/AlertMessage';
import { CharacterDisplay }   from './_components/Character/CharacterDisplay';
import { InputForm }          from './_components/UserInterface/InputForm';
import { UserInterface }      from './_components/UserInterface/UserInterface';
import { Loading }            from '@/app/_components/layouts/loading/layout';
import { useErrorHandling }   from './_hooks/useErrorHandling';
// Hooks
import { useState, useEffect } from 'react';
import { useHelper }           from '@/app/_contexts/HelperContext';
import { useSession }          from 'next-auth/react';
// Custom Hooks
import { useHelperInitData } from './_hooks/useHelperInitData';
// Types
import { Conversation, Decision } from '@/app/_types';
import { createConversation,
         updateConversation,
         createCharacterResponses,
         createDecision,
         updateDecision,
         deleteDecision,
         updateUser,
         createTag,
         createDecisionTags,
        } from '@/app/_features/fetchAPI';
import { init } from 'next/dist/compiled/webpack/webpack';
import { set } from 'zod';

interface CharacterResponse {
  conversation_id: number;
  character_id?:   number;
  response:        string;
}

export default function decisionHelper () {
  const { data: session } = useSession();
  // ページ読み込み時に取得する情報（キャラクター情報）
  const { userCharacters,
          currentUser,
          setCurrentUser,
          fetchHelperInitData } = useHelperInitData();
  // ドロワーとの連携
  const { isDrawerClick, setIsDrawerClick } = useHelper();
  const { drawerLink,    setDrawerLink }    = useHelper();
  // 深掘り機能
  const [ beforeQueryText,          setBeforeQueryText ]          = useState('');
  const [ beforeCharacterResponses, setBeforeCharacterResponses ] = useState<CharacterResponse[]>([]);
  const [ conversationCount,        setConversationCount ]        = useState<number>(1);
  // データ格納用
  const [ queryText,          setQueryText ]          = useState<string>('');
  const [ characterResponses, setCharacterResponses ] = useState<CharacterResponse[]>([]);
  const [ decision,           setDecision ]           = useState<Decision>();
  const [ conversation,       setConversation ]       = useState<Conversation>();
  const [ isResponse,         setIsResponse ]         = useState<boolean>(false);
  // バックグラウンド機能（ローディング）
  const [ isLoading , setIsLoading ] = useState<boolean>(false);
  // エラー処理
  const { errors,
          isError,
          addErrorMessages,
          removeErrorMessages,
          resetErrorMessages } = useErrorHandling();
  // チェックボックス関係
  const [ isCheckModal, setIsCheckModal ] = useState<boolean>(false);
  // ユーザーインターフェース関係
  const [ tags,         setTags ]         = useState<string[]>([]);
  const [ userDecision, setUserDecision ] = useState<CharacterResponse>();
  const [ isPublic,     setIsPublic ]     = useState<boolean>(false);
  // 入力フォーム
  const [ placeholder,     setPlaceholder     ] = useState<string>('悩みを入力してください（50文字以内）');
  const { remainingTokens, setRemainingTokens } = useHelper();
  // 通信用JWTトークン
  const [ token, setToken ] = useState<string>('');

  //////////////////// Debug ////////////////////

  {/* init data */}
  useEffect(() => {
    console.log("Update init data")
    console.log('userCharacters', userCharacters);
    console.log('currentUser', currentUser);
  }, [userCharacters, currentUser]);

  {/* state */}
  useEffect(() => {
    console.log("Update state");
    console.log('queryText', queryText);
    console.log('characterResponses', characterResponses);
    console.log('decision', decision);
    console.log('conversation', conversation);
    console.log('isResponse', isResponse);
  }, [queryText, characterResponses, decision, conversation, isResponse]);

  {/* error */}
  useEffect(() => {
    console.log("Update error")
    console.log('errors', errors);
    console.log('isError', isError);
  }, [errors, isError]);

  {/* user interface */}
  useEffect(() => {
    console.log("Update user interface")
    console.log('tags', tags);
    console.log('userDecision', userDecision);
    console.log('isPublic', isPublic);
  }, [tags, userDecision, isPublic]);

  {/* helper */}
  useEffect(() => {
    console.log("Update helper")
    console.log('isDrawerClick', isDrawerClick);
    console.log('remainingTokens', remainingTokens);
  }, [isDrawerClick, remainingTokens]);

  ///////////////////////////////////////////////


  ///////////////////////////////////////////////
  //////////////// Set init data ////////////////
  ///////////////////////////////////////////////

  useEffect(() => {
    if(session) {
      setToken(session?.appAccessToken!);
    }
  }, [session]);

  useEffect(() => {
    if(token){
      fetchHelperInitData();
      resetErrorMessages();
    }
  }, [token]);

  ///////////////////////////////////////////////
  /////////////// Create Decision ///////////////
  ///////////////////////////////////////////////

  // openAIに送信するためのデータ
  interface OpenAiRequest {
    decisionId:        number;
    queryText:         string;
    conversationCount: number;
    beforeQueryText:   string;
    userDecision:      string | null;
  }

  //  入力フォームに値が入力された時の処理
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQueryText(event.target.value);
  }

  // 「相談する」ボタンを押した時の処理
  const handleCreateConversation = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    // エラーハンドリング
    if (isError) return;
    if (!queryText) {
      alert('テキストを入力してください。');
      return;
    }
    if (queryText.length > 50) {
      addErrorMessages({
        message: `文字数がオーバーしています。（現在の入力文字数：${queryText.length}/50文字）`,
        kind: 'inputText'
      });
      return;
    }

    try {
      setIsLoading(true);
      // set関数が非同期なのでダミーデータとしてcurrentDecisionを用意
      let currentDecision : any = decision ? decision : null;
      // openAIに送信するためのデータを作成
      // 1. ユーザーがテキストを入力して「相談する」ボタンを押す
      // 2. queryTextをcreateDecision関数に渡す = Decisionを作成する
      if (conversationCount === 1) {
        const response  = await createDecision(token!);
        currentDecision = assignCurrentDecision(response);
        setDecision(currentDecision);
      }
      // 2. decision.idとuserDecisionをupdateConversation関数に渡す = 1度目のConversationを更新する
      if (conversationCount === 2) {
        const updatedConversation = await updateConversation(token!, conversation!.id, queryText, userDecision!);
        setConversation(updatedConversation);
      }

      const fetchData: OpenAiRequest = {
        queryText,
        decisionId         : currentDecision!.id,
        conversationCount,
        beforeQueryText    : conversationCount === 1 ? ''   : beforeQueryText,
        userDecision       : conversationCount === 1 ? null : userDecision!.response,
      }

      // 3. queryTextをOpenAiRequest関数に渡す  = OpenAiにリクエストを送る
      const openAiResponse = await OpenAiRequest(fetchData);
      const processedResponse = JSON.parse(openAiResponse.response.choices[0].message.content);
      const parsedResponse = parseResponse(processedResponse);

      // 4. 2のdecision.idと3のCharacterResponsesをcreateConversation関数に渡す = Conversationを作成する
      const createdConversation = await createConversation(
        token!,
        currentDecision!.id,
        queryText,
        parsedResponse
      );
      setConversation(createdConversation.conversation);
      setCharacterResponses(createdConversation.character_responses)

      const user = await updateUser(token!, currentUser!.id, remainingTokens);
      setCurrentUser(user);
      setRemainingTokens(user.token);


      // 5. beforeQueryTextとbeforeCharacterResponsesを更新する
      setBeforeQueryText(queryText);
      setBeforeCharacterResponses(createdConversation.character_responses);

      // 6. beforeQueryTextとbeforeCharacterResponsesを表示する
      setQueryText('');

      if (conversationCount === 1) {
        setIsResponse(true);
        setConversationCount(2);
        setPlaceholder('悩みを深掘りする場合は追加の相談文を入力してください（50文字以内）');
      } else {
        setConversationCount(3);
      }
    } catch (error: any) {
      addErrorMessages({
        message: error.message,
        kind: 'openai'
      });
      // 一連の流れでエラーが発生した場合、作成したDecisionを削除する
      if (decision) {
        await deleteDecision(token!, decision.id);
      }
    } finally {
      setIsLoading(false);
    }
  }

  const  assignCurrentDecision = (response: any) => {
    return {
      id:         response.decision.id,
      user_id:    response.decision.user_id,
      public:     response.decision.public,
      created_at: response.decision.created_at,
      updated_at: response.decision.updated_at,
    };
  }

  const OpenAiRequest = async (fetchData: OpenAiRequest) => {
    try {
      const response = await axios({
        method: 'post',
        url: `${process.env.NEXT_PUBLIC_API_URL}/api/openai/v1/callback`,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Authorization': `Bearer ${token}`
        },
        data: { fetchData },
        withCredentials: true,
      });
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.error('Error creating decision', error);
    }
  }

  const parseResponse = (data: any) => {
    // オブジェクトのキーを使用して動的に処理
    return Object.keys(data).map(key => {
      const characterData = data[key];
      // 各オブジェクトには{character1_name: "a"}や{character2_name: "b"}のような形でnameが格納されている
      // そのため、nameを取得するためにキーにnameを含むものを探す
      const nameKey = Object.keys(characterData).find(k => k.includes('name'));
      const characterId = userCharacters?.find(c => c.name === characterData[nameKey!])?.id;
      // 各オブジェクトには{character1_response: "a"}や{character2_response: "b"}のような形でresponseが格納されている
      // そのため、responseを取得するためにキーにresponseを含むものを探す
      const responseKey = Object.keys(characterData).find(k => k.includes('response'));
      const characterResponse = characterData[responseKey!];

      return {
        conversation_id: conversation?.id!,
        character_id: characterId,
        response: characterResponse
      };
    });
  };

  ///////////////////////////////////////////////
  //////////////// Save Decision ////////////////
  ///////////////////////////////////////////////

  const handleSaveDecision = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    // エラーハンドリング
    if (isError) return;
    if (!tags || tags.length === 0 || !userDecision) {
      alert('タグを入力し、どちらかのキャラクターを選択してください。');
      return;
    }

    try {
      setIsLoading(true);
      // 2. decision.idとuserDecisionをupdateConversation関数に渡す = 1度目のConversationを更新する
      const updatedConversation = await updateConversation(token!, conversation!.id, queryText, userDecision!);
      setConversation(updatedConversation);

      // 3. remainingTokensとtagsとisPublicをupdateDecision関数に渡す = Decisionを更新する
      const updatedDecision = await updateDecision(token!, decision!.id, isPublic);
      setDecision(updatedDecision);

      // 4. decision.idとtagsをcreateTags関数に渡す = DecisionTagsを作成する
      await createTag(token!, tags);
      await createDecisionTags(token!, decision!.id, tags)

      // 5. remainingTokensをupdateUser関数に渡す = Userを更新する
      await updateUser(token!, currentUser!.id, remainingTokens);

      // 6. 保存が完了したらページ内の状態を全てデフォルトに戻す
      initializeState();
    } catch (error: any) {
      addErrorMessages({
        message: error.message,
        kind: 'openai'
      });
    } finally {
      fetchHelperInitData();
      setIsLoading(false);
    }
  }


  // すべてのstateを初期化する関数
  const initializeState = () => {
    resetErrorMessages();

    setCharacterResponses([]);
    setBeforeQueryText('');
    setPlaceholder('悩みを入力してください（50文字以内）');
    setIsResponse(false);
    setQueryText('');
    setTags([]);
    setUserDecision(undefined);
    setIsPublic(false);
    setConversationCount(1);

    return;
  }


  useEffect(() => {
    if(isDrawerClick && drawerLink != '/helper') {
      setIsDrawerClick(false);
    } else if (isDrawerClick && drawerLink == '/helper') {
      if (conversationCount === 1) {
        initializeState();
        setIsDrawerClick(false);
      } else {
        if (window.confirm('現在の相談内容はそのまま保存されます。消費したトークンは戻ってきませんがよろしいですか？')) {
          initializeState();
          setIsDrawerClick(false);
        } else {
          setIsDrawerClick(false);
        }
      }
    }
  }, [isDrawerClick, drawerLink]);


  useEffect(() => {
    if(tags.length > 0 && userDecision!.response !== '') {
      removeErrorMessages('validation');
    }
  }, [tags, userDecision]);

  // 入力フォームの内容が変更された場合の処理
  useEffect(() => {
    const queryTextLength = queryText.length;
    // 入力フォームに何も入力されていない場合エラーをリセットする
    if (queryTextLength === 0) {resetErrorMessages()}
    // 入力フォームに入力された文字数をトークン数から引いて残りトークン数を計算する
    if ( currentUser ) { setRemainingTokens(currentUser.token - queryTextLength) }

    // 入力テキストが50文字を超える場合
    if (queryTextLength > 50) {
      addErrorMessages({
        message: `文字数がオーバーしています。（現在の入力文字数：${queryTextLength}/50文字）`,
        kind: 'inputText'
      });
    } else if (queryTextLength <= 50) {
      removeErrorMessages('inputText');
    }
  }, [queryText, currentUser]);

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
      { !userCharacters && <div className='w-full min-h-screen'><Loading /></div> }
      { isLoading && <div className='w-full min-h-screen'><Loading /></div> }
      { userCharacters && !isLoading && (
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
                  conversationId={conversation?.id!}
                  userCharacters={userCharacters!}
                  responses={characterResponses}
                  userDecision={userDecision!}
                  setUserDecision={setUserDecision}
                  isResponse={isResponse} />
              </div>
              <div id='control-window' className='flex flex-col w-[30%] h-full border-2 border-black ml-3 rounded-md items-center justify-end'>
                { isResponse && <UserInterface
                  tags={tags}
                  setTags={setTags}
                  isPublic={isPublic}
                  setIsPublic={setIsPublic}
                  saveDecision={handleSaveDecision}
                   />
                }
              </div>
            </div>
            <div id='input-form' className='w-full grow-[3] flex items-center justify-center border-2 rounded-md border-black mt-3'>
              { conversationCount != 3 && 
                <InputForm
                  inputText={queryText}
                  handleChange={handleChange}
                  placeholder={placeholder}
                  sendText={handleCreateConversation}
                  token={token}
                  decisionId={decision?.id!}
                  characterResponses={characterResponses}
                />
              }
            </div>
          </div>
        </div>
      )}
    </>
  );
}