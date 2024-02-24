/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-duplicates */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

// eslint-disable-next-line import/order
import { ChatBubbleBottomCenterIcon as ChatIconOutline } from '@heroicons/react/24/outline'
import { BookOpenIcon as BookIconOutline } from '@heroicons/react/24/outline'
import { InformationCircleIcon as InformationIconOutline } from '@heroicons/react/24/outline'
import {
  ChatBubbleBottomCenterIcon as ChatIconSolid,
  BookOpenIcon as BookIconSolid,
  InformationCircleIcon as InformationIconSolid,
} from '@heroicons/react/24/solid'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'

import { AlertMessage } from '@/app/_components/helper/AlertMessage'
import { CharacterResponseDisplay } from '@/app/_components/helper/Character/CharacterResponseDisplay'
import { Steps } from '@/app/_components/helper/Information/Steps'
import { QueryInputForm } from '@/app/_components/helper/UserInterface/QueryInputForm'
import { TagInputForm } from '@/app/_components/helper/UserInterface/TagInputForm'
import { Loading } from '@/app/_components/layouts/loading/layout'
import { useCharacterList } from '@/app/_contexts/_featureContexts/CharacterListContext'
import { useDrawer } from '@/app/_contexts/_featureContexts/DrawerContext'
import { useHelper } from '@/app/_contexts/_featureContexts/HelperContext'
import { useCharacter } from '@/app/_contexts/_globalContexts/CharacterContext'
import { useUserInfo } from '@/app/_contexts/_globalContexts/UserInfoContext'
import { InitializeHelperData } from '@/app/_features/InitializeHelperData'
import {
  createConversation,
  updateConversation,
  createCharacterResponses,
  createDecision,
  updateDecision,
  deleteDecision,
  updateUser,
  createTag,
  createDecisionTags,
} from '@/app/_features/fetchAPI'
import { createDecisionCharacter } from '@/app/_features/fetchAPI/fetchDecisionCharacter'
import { useErrorHandling } from '@/app/_hooks/_helper/useErrorHandling'
import { Conversation, Decision } from '@/app/_types'

interface CharacterResponse {
  id: number
  conversation_id: number
  character_id?: number
  response: string
}

export default function DecisionHelper() {
  const { data: session } = useSession()
  const { setInputTags } = useHelper()
  const { setDisplayTags } = useHelper()
  // ページ読み込み時に取得する情報（キャラクター情報）
  const { userCharacters, setUserCharacters } = useCharacter()
  const { userCharactersList, setUserCharactersList } = useCharacterList()
  const { currentUser, setCurrentUser } = useUserInfo()
  // ドロワーとの連携
  const { isDrawerClick, setIsDrawerClick } = useDrawer()
  const { drawerLink, setDrawerLink } = useDrawer()
  // 深掘り機能
  const { beforeQueryText, setBeforeQueryText } = useHelper()
  const [beforeCharacterResponses, setBeforeCharacterResponses] = useState<
    CharacterResponse[]
  >([])
  const { conversationCount, setConversationCount } = useHelper()
  // データ格納用
  const { queryText, setQueryText } = useHelper()
  const [characterResponses, setCharacterResponses] = useState<CharacterResponse[]>([])
  const [decision, setDecision] = useState<Decision>()
  const [conversation, setConversation] = useState<Conversation>()
  const [isResponse, setIsResponse] = useState<boolean>(false)
  // バックグラウンド機能（ローディング）
  const [isLoading, setIsLoading] = useState<boolean>(false)
  // エラー処理
  const { errors, isError, addErrorMessages, removeErrorMessages, resetErrorMessages } =
    useErrorHandling()
  // ユーザーインターフェース関係
  const [tags, setTags] = useState<string[]>([])
  const { userDecision, setUserDecision } = useHelper()
  const { tagAlert } = useHelper()
  const { beforeUserDecision, setBeforeUserDecision } = useHelper()
  const [isPublic, setIsPublic] = useState<boolean>(false)
  // 入力フォーム
  const [placeholder, setPlaceholder] =
    useState<string>('悩みを入力してください（50文字以内）')
  const { remainingTokens, setRemainingTokens } = useHelper()
  const { isSaveDecision, setIsSaveDecision } = useHelper()
  // 通信用JWTトークン
  const [token, setToken] = useState<string>('')
  // informationウインドウの管理
  const { isClickInformation, setIsClickInformation } = useHelper()

  ///////////////////////////////////////////////
  //////////////// Set init data ////////////////
  ///////////////////////////////////////////////

  useEffect(() => {
    if (session) {
      setToken(session?.appAccessToken)
    }
  }, [session])

  useEffect(() => {
    if (token) {
      initializeState()
      InitializeHelperData({
        token,
        setUserCharacters,
        setUserCharactersList,
        setCurrentUser,
        setIsLoading,
      })
      resetErrorMessages()
    }
  }, [token])

  useEffect(() => {
    if (conversationCount == 1) {
      initializeState()
      setIsClickInformation(false)
    }
  }, [conversationCount])

  ///////////////////////////////////////////////
  /////////////// Create Decision ///////////////
  ///////////////////////////////////////////////

  // openAIに送信するためのデータ
  interface OpenAiRequest {
    decisionId: number
    queryText: string
    conversationCount: number
    beforeQueryText: string
    userDecision: string | null
  }

  useEffect(() => {
    if (queryText.length <= 50) {
      removeErrorMessages('inputText')
    }
    if (conversationCount === 2 && userDecision) {
      removeErrorMessages('selectCharacter')
    }
  }, [userDecision, queryText])

  // 「相談する」ボタンを押した時の処理
  const handleCreateConversation = async () => {
    // エラーハンドリング
    if (isError) return
    if (!queryText) {
      alert('テキストを入力してください。')
      return
    }
    if (queryText.length > 50) {
      addErrorMessages({
        message: `文字数がオーバーしています。（現在の入力文字数：${queryText.length}/50文字）`,
        kind: 'inputText',
      })
      return
    }
    if (conversationCount === 2 && !userDecision) {
      addErrorMessages({
        message: 'キャラクターを選択してください。',
        kind: 'selectCharacter',
      })
      return
    }

    try {
      setIsLoading(true)
      let currentDecision: Decision | null = decision ? decision : null

      // 1. Decisionの作成
      if (conversationCount === 1) {
        const response = await createDecision(token)
        currentDecision = assignCurrentDecision(response)
        await createDecisionCharacter(token, currentDecision.id, userCharactersList)
        setDecision(currentDecision)
      }
      console.log('errorここ？1')

      // 1. 深掘りの場合は既存のConversationに対してユーザーの決定を反映する
      if (conversationCount === 2) {
        setBeforeUserDecision(userDecision)
        const updatedConversation = await updateConversation(
          token,
          conversation!.id,
          queryText,
          userDecision!,
        )
        setConversation(updatedConversation)
      }
      console.log('errorここ？2')

      // OpenAI APIに送信するデータを作成する
      const fetchData: OpenAiRequest = {
        queryText,
        decisionId: currentDecision!.id,
        conversationCount,
        beforeQueryText: conversationCount === 1 ? '' : beforeQueryText,
        userDecision: conversationCount === 1 ? null : userDecision!.response,
      }
      console.log('errorここ？3')

      // 3. Decisionに紐づくConversationを作成する
      const createdConversation = await createConversation(
        token,
        currentDecision!.id,
        queryText,
      )
      setConversation(createdConversation)
      console.log('errorここ？4')

      // 4. OpenAI APIを叩いてResponseを整形する
      const openAiResponse = await OpenAiRequest(fetchData)
      const processedResponse = JSON.parse(
        openAiResponse.response.choices[0].message.content,
      )
      const parsedResponse = parseResponse(processedResponse, createdConversation)
      console.log('errorここ？5')

      // 5. 4の結果を元にConversationに紐づく
      const currentCharacterResponses = await createCharacterResponses(
        token,
        parsedResponse,
      )
      setCharacterResponses(parsedResponse)
      console.log('errorここ？6')

      const user = await updateUser(token, currentUser.id, remainingTokens)

      if (user) {
        setCurrentUser(user)
        setRemainingTokens(user.token)
      }

      // 5. beforeQueryTextとbeforeCharacterResponsesを更新する
      if (conversationCount === 1) {
        setBeforeQueryText(queryText)
        setQueryText('')
      }
      if (currentCharacterResponses) {
        setBeforeCharacterResponses(currentCharacterResponses)
      }

      // 6. beforeQueryTextとbeforeCharacterResponsesを表示する

      if (conversationCount === 1) {
        setIsResponse(true)
        setConversationCount(2)
        setPlaceholder(
          '悩みを深掘りする場合は追加の相談文を入力してください（50文字以内）',
        )
      } else {
        setConversationCount(3)
      }
    } catch (error: any) {
      setIsLoading(false)
      addErrorMessages({
        message: error.message,
        kind: 'openai',
      })
      // 一連の流れでエラーが発生した場合、作成したDecisionを削除する
      if (decision) {
        await deleteDecision({
          token: token,
          decisionId: decision.id,
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const assignCurrentDecision = (response: any) => {
    return {
      id: response.id,
      user_id: response.user_id,
      public: response.public,
      created_at: response.created_at,
      updated_at: response.updated_at,
    }
  }

  const OpenAiRequest = async (fetchData: OpenAiRequest) => {
    try {
      const response = await axios({
        method: 'post',
        url: `${process.env.NEXT_PUBLIC_API_URL}/api/openai/v1/callback`,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          Authorization: `Bearer ${token}`,
        },
        data: { fetchData },
        withCredentials: true,
      })
      if (response.status === 200) {
        return response.data
      }
    } catch (error) {
      console.error('Error creating decision', error)
    }
  }

  const parseResponse = (data: any, conversation: Conversation) => {
    // オブジェクトのキーを使用して動的に処理
    return Object.keys(data).map((key) => {
      const characterData = data[key]
      // 各オブジェクトには{character1_name: "a"}や{character2_name: "b"}のような形でnameが格納されている
      // そのため、nameを取得するためにキーにnameを含むものを探す
      const nameKey = Object.keys(characterData).find((k) => k.includes('name'))
      const characterId = userCharacters?.find(
        (c) => c.name === characterData[nameKey!],
      )?.id
      // 各オブジェクトには{character1_response: "a"}や{character2_response: "b"}のような形でresponseが格納されている
      // そのため、responseを取得するためにキーにresponseを含むものを探す
      const responseKey = Object.keys(characterData).find((k) => k.includes('response'))
      const characterResponse = characterData[responseKey!]

      return {
        id: 0,
        conversation_id: conversation?.id,
        character_id: characterId,
        response: characterResponse,
      }
    })
  }

  ///////////////////////////////////////////////
  //////////////// Save Decision ////////////////
  ///////////////////////////////////////////////

  const handleSaveDecision = async () => {
    // エラーハンドリング
    if (isError) return
    if (tagAlert.length > 0) {
      setIsClickInformation(true)
      return
    }
    if (!tags || tags.length === 0 || !userDecision) {
      alert('タグを入力し、どちらかのキャラクターを選択してください。')
      return
    }

    try {
      setIsLoading(true)
      // 2. decision.idとuserDecisionをupdateConversation関数に渡す = 1度目のConversationを更新する
      const updatedConversation = await updateConversation(
        token,
        conversation!.id,
        queryText,
        userDecision,
      )
      setConversation(updatedConversation)

      // 3. remainingTokensとtagsとisPublicをupdateDecision関数に渡す = Decisionを更新する
      const updatedDecision = await updateDecision(token, decision!.id, isPublic)
      setDecision(updatedDecision)

      // 4. decision.idとtagsをcreateTags関数に渡す = DecisionTagsを作成する
      await createTag(token, tags)
      await createDecisionTags(token, decision!.id, tags)

      // 5. remainingTokensをupdateUser関数に渡す = Userを更新する
      await updateUser(token, currentUser.id, remainingTokens)

      // 6. 保存が完了したらページ内の状態を全てデフォルトに戻す
      initializeState()
    } catch (error: any) {
      addErrorMessages({
        message: error.message,
        kind: 'openai',
      })
    } finally {
      InitializeHelperData({
        token,
        setUserCharacters,
        setUserCharactersList,
        setCurrentUser,
        setIsLoading,
      })
      setIsLoading(false)
    }
  }

  // すべてのstateを初期化する関数
  const initializeState = () => {
    resetErrorMessages()

    setCharacterResponses([])
    setBeforeQueryText('')
    setPlaceholder('悩みを入力してください（50文字以内）')
    setIsResponse(false)
    setQueryText('')
    setTags([])
    setUserDecision(undefined)
    setIsPublic(false)
    setConversationCount(1)
    setIsSaveDecision(false)
    setInputTags('')
    setDisplayTags([])

    return
  }

  useEffect(() => {
    if (isDrawerClick && drawerLink != '/helper') {
      setIsDrawerClick(false)
    } else if (isDrawerClick && drawerLink == '/helper') {
      if (conversationCount === 1) {
        initializeState()
        setIsDrawerClick(false)
      } else if (isResponse && conversationCount !== 1) {
        if (
          window.confirm(
            '現在の相談内容はそのまま保存されます。\r\n後から相談内容の変更や深掘り・決断は行えません。\r\n消費したトークンは戻ってきませんがよろしいですか？',
          )
        ) {
          initializeState()
          setIsDrawerClick(false)
        } else {
          setIsDrawerClick(false)
        }
      }
    }
  }, [isDrawerClick, drawerLink])

  // 入力フォームの内容が変更された場合の処理
  useEffect(() => {
    const queryTextLength = queryText.length
    // 入力フォームに何も入力されていない場合エラーをリセットする
    if (queryTextLength === 0) {
      resetErrorMessages()
    }
    // 入力フォームに入力された文字数をトークン数から引いて残りトークン数を計算する
    if (currentUser) {
      setRemainingTokens(currentUser.token - queryTextLength)
    }

    // 入力テキストが50文字を超える場合
    if (queryTextLength > 100) {
      addErrorMessages({
        message: `文字数がオーバーしています。（現在の入力文字数：${queryTextLength}/100文字）`,
        kind: 'inputText',
      })
    } else if (queryTextLength <= 100) {
      removeErrorMessages('inputText')
    }
  }, [queryText, currentUser])

  // 残りトークン数が0以下になった場合
  useEffect(() => {
    if (remainingTokens < 0) {
      addErrorMessages({
        message: `トークン数が不足しています。（残りトークン数：${remainingTokens}）`,
        kind: 'token',
      })
    } else {
      removeErrorMessages('token')
    }
  }, [remainingTokens])

  // エラーがなくなった時にスクロールをトップに戻す
  useEffect(() => {
    if (!isError) {
      window.scrollTo(0, 0)
    }
  })

  // 情報ディスプレイを開く
  const handleClickInformation = () => {
    setIsClickInformation(!isClickInformation)
  }

  console.log('userCharacters', userCharacters)

  return (
    <>
      {!userCharacters ||
        (userCharacters.length != 2 && (
          <div className='w-full min-h-screen'>
            <Loading />
          </div>
        ))}
      {isLoading && (
        <div className='w-full min-h-screen'>
          <Loading />
        </div>
      )}
      {userCharacters && userCharacters.length == 2 && !isLoading && (
        <div className='flex flex-col w-full min-h-screen items-center justify-start pt-3 mt-14'>
          {isError && <AlertMessage errors={errors} />}
          <div
            id='main-contents'
            className='w-[60%] min-h-[80vh] rounded-md border shadow-lg flex flex-col py-3 overflow-hidden'
          >
            <div className='sticky justify-center inset-x-0 top-1 mx-auto min-h-20 z-10'>
              <Steps />
            </div>
            <div className='flex flex-col w-full h-full items-center justify-center py-10'>
              {conversationCount === 1 && (
                <>
                  <div className='flex flex-col items-center justify-center w-[80%] min-h-[60%] max-h-[80%] border pt-6 pb-3 mb-6 overflow-auto'>
                    {userCharacters.map((character, index) => {
                      // characterの中にcharacter1_welcome,character2_welcomeがあり、indexに応じてどちらを表示するかを判断する
                      const whichWelcome =
                        index === 0 ? 'character1_welcome' : 'character2_welcome'
                      const welcome = character[whichWelcome]
                      return (
                        <CharacterResponseDisplay
                          key={character.id}
                          decisionCharacter={character}
                          characterResponse={null}
                          setUserDecision={setUserDecision}
                          isResponse={isResponse}
                          welcome={welcome}
                        />
                      )
                    })}
                  </div>
                  <div className='flex flex-col w-full items-center justify-center'>
                    <div className='flex flex-row w-full items-center justify-center'>
                      <div className='flex w-[80%]'>
                        <QueryInputForm
                          handleCreateConversation={handleCreateConversation}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
              {conversation && conversationCount === 2 && (
                <>
                  <div className='flex flex-col items-center justify-center w-[80%] min-h-[60%] max-h-[80%] border pt-6 pb-3 mb-6 overflow-auto'>
                    {userCharacters.map((character) => {
                      const characterResponse = characterResponses.find(
                        (c) => c.character_id === character.id,
                      )
                      return (
                        <CharacterResponseDisplay
                          key={character.id}
                          decisionCharacter={character}
                          characterResponse={characterResponse!}
                          conversationId={conversation.id}
                          userDecision={userDecision}
                          setUserDecision={setUserDecision}
                          isResponse={isResponse}
                        />
                      )
                    })}
                  </div>
                  <div className='flex flex-col w-full items-center justify-center'>
                    <div className='flex flex-row w-full items-center justify-center'>
                      <div className='flex w-[80%]'>
                        {isSaveDecision ? (
                          <TagInputForm
                            setTags={setTags}
                            saveDecision={handleSaveDecision}
                          />
                        ) : (
                          <QueryInputForm
                            handleCreateConversation={handleCreateConversation}
                          />
                        )}
                      </div>
                      <div className='flex flex-row h-10 items-center ml-3'>
                        <div className='flex h-[1.5rem]'>
                          {!isClickInformation && (
                            <InformationIconOutline
                              title='informationを開く'
                              onClick={handleClickInformation}
                            />
                          )}
                          {isClickInformation && (
                            <InformationIconSolid
                              title='informationを閉じる'
                              onClick={handleClickInformation}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className='flex w-[75%] justify-between items-center mt-1'>
                      <div className='flex flex-row items-center'>
                        <div className='flex h-[1.5rem] mr-1'>
                          {isSaveDecision ? <ChatIconOutline /> : <ChatIconSolid />}
                        </div>
                        <input
                          type='checkbox'
                          className='toggle theme-controller'
                          onChange={() => setIsSaveDecision((current) => !current)}
                        />
                        <div className='flex h-[1.5rem] ml-1'>
                          {isSaveDecision ? <BookIconSolid /> : <BookIconOutline />}
                        </div>
                      </div>
                      <div className='form-control mr-6'>
                        <label className='cursor-pointer label flex flex-row items-center'>
                          <span className='label-text mr-1'>公開設定</span>
                          <input
                            type='checkbox'
                            className='checkbox checkbox-secondary'
                            onChange={() => setIsPublic((current) => !current)}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {conversation && conversationCount === 3 && (
                <>
                  <div className='flex flex-col items-center justify-center w-[80%] min-h-[60%] max-h-[80%] border pt-6 pb-3 mb-6 overflow-auto'>
                    {userCharacters.map((character) => {
                      const characterResponse = characterResponses.find(
                        (c) => c.character_id === character.id,
                      )
                      return (
                        <CharacterResponseDisplay
                          key={character.id}
                          decisionCharacter={character}
                          characterResponse={characterResponse!}
                          conversationId={conversation.id}
                          userDecision={userDecision}
                          setUserDecision={setUserDecision}
                          isResponse={isResponse}
                        />
                      )
                    })}
                  </div>
                  <div className='flex flex-col w-full items-center justify-center'>
                    <div className='flex flex-row w-full items-center justify-center'>
                      <div className='flex w-[80%]'>
                        <TagInputForm
                          setTags={setTags}
                          saveDecision={handleSaveDecision}
                        />
                      </div>
                      <div className='flex flex-row h-10 items-center ml-3'>
                        <div className='flex h-[1.5rem]'>
                          {!isClickInformation && (
                            <InformationIconOutline
                              title='informationを開く'
                              onClick={handleClickInformation}
                            />
                          )}
                          {isClickInformation && (
                            <InformationIconSolid
                              title='informationを閉じる'
                              onClick={handleClickInformation}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className='flex w-[75%] justify-end items-center mt-1'>
                      <div className='form-control mr-6'>
                        <label className='cursor-pointer label flex flex-row items-center'>
                          <span className='label-text mr-1'>公開設定</span>
                          <input
                            type='checkbox'
                            className='checkbox checkbox-secondary'
                            onChange={() => setIsPublic((current) => !current)}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
