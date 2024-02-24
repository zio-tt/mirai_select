/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { DndProvider, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { Loading } from '@/app/_components/layouts/loading/layout'
import { MyPageMenu } from '@/app/_components/mypage/MyPageMenu'
import { CharacterDetailModal } from '@/app/_components/mypage/character/CharacterDetailModal'
import { CharacterList } from '@/app/_components/mypage/character/CharacterList'
import { CreateCharacter } from '@/app/_components/mypage/character/create/CreateCharacter'
import { DroppableCharacter } from '@/app/_components/mypage/character/drag/DroppableCharacter'
import { useCharacterList } from '@/app/_contexts/_featureContexts/CharacterListContext'
import { useCharacter } from '@/app/_contexts/_globalContexts/CharacterContext'
import { useGlobalState } from '@/app/_contexts/_globalContexts/GlobalStateContext'
import {
  getCharacters,
  getUserCharacters,
  getCustomCharacters,
  editCharacter,
  createCharacter,
  updateUserCharacter,
  deleteCharacter,
} from '@/app/_features/fetchAPI'
import { Character, UserCharacter } from '@/app/_types'

const MyPageCharactersContent = () => {
  // CurrentUserが使用するキャラクターを選択する
  // APIから取得する情報
  const { characters, setCharacters } = useCharacter()
  const { customCharacters, setCustomCharacters } = useCharacter()
  const { userCharacters, setUserCharacters } = useCharacter()

  const { customCharactersList, setCustomCharactersList } = useCharacterList()
  const { userCharactersList, setUserCharactersList } = useCharacterList()
  const { selectCharacter, setSelectCharacter } = useCharacterList()
  const { avatarUrl, setAvatarUrl } = useCharacterList()
  const { avatar, setAvatar } = useCharacterList()
  const { previewAvatar, setPreviewAvatar } = useCharacterList()

  const [resUserCharacter, setResUserCharacter] = useState<UserCharacter[]>([])

  const { isCreate, setIsCreate } = useCharacterList()
  const { isEdit, setIsEdit } = useCharacterList()

  const { setIsModalOpen } = useGlobalState()
  const { isLoading, setIsLoading } = useGlobalState()

  const { data: session } = useSession()
  const token = session?.appAccessToken

  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // 編集画面においてプルダウンで表示する内容を配列で作成しておく
  // バックエンドに送る内容は英語だが、表示する内容は日本語にしたいのでオブジェクト型の配列で作成する
  // MBTI_Typeの日本語はISTJ: 管理者。実用的で事実に基づいた思考の持ち主。の様に表記する
  // mbti_type
  const MBTI_Type: { [key: string]: string }[] = [
    { ISTJ: 'ISTJ(管理者)：実用的で事実に基づいた思考の持ち主。' },
    { ISFJ: 'ISFJ(擁護者)：非常に献身的で心の温かい擁護者。' },
    {
      INFJ: 'INFJ(提唱者)：物静かで神秘的だが、人々を非常に勇気づける飽くなき理想主義者',
    },
    { INTJ: 'INTJ(建築家)：想像力が豊かで、戦略的な思考の持ち主。' },
    { ISTP: 'ISTP(巨匠)：大胆で実践的な思考を持つ実験者。' },
    { ISFP: 'ISFP(冒険家)：柔軟性と魅力がある芸術家。' },
    { INFP: 'INFP(仲介者)：詩人肌で親切な利他主義者。' },
    { INTP: 'INTP(論理学者)：貪欲な知識欲を持つ革新的な発明家' },
    { ESTP: 'ESTP(起業家)：賢くてエネルギッシュで、非常に鋭い知覚の持ち主。' },
    {
      ESFP: 'ESFP(エンターテイナー)：自発性がありエネルギッシュで熱心なエンターテイナー。',
    },
    { ENFP: 'ENFP(運動家)：情熱的で独創力があり、かつ社交的な自由人。' },
    { ENTP: 'ENTP(討論者)：賢くて好奇心旺盛な思考家。' },
    {
      ESTJ: 'ESTJ(幹部)：優秀な管理者で、物事や人々を管理する能力にかけては、右に出る者はいない。',
    },
    { ESFJ: 'ESFJ(領事)：非常に思いやりがあり社交的で、人気がある。' },
    { ENFJ: 'ENFJ(主人公)：カリスマ性があり、人々を励ますリーダー。' },
    { ENTJ: 'ENTJ(指揮官)：大胆で想像力豊か、かつ強い意志を持つ指導者。' },
  ]
  // tone
  const Tone: { [key: string]: string }[] = [
    { polite: '丁寧' },
    { calm: '落ち着いた' },
    { casual: 'カジュアル' },
    { energetic: '活発' },
    { confident: '自信がある' },
    { logical: '論理的' },
  ]
  // expression
  const Expression: { [key: string]: string }[] = [
    { humorous: 'ユーモア' },
    { sarcastic: '皮肉' },
    { passionate: '情熱的' },
    { creative: '創造的' },
    { proactive: '積極的' },
    { passive: '消極的' },
    { emotional: '感情的' },
    { serious: '真面目' },
    { irresponsible: '不真面目' },
    { negative: 'ネガティブ' },
    { positive: 'ポジティブ' },
    { kind: '優しい' },
    { strict: '厳しい' },
  ]
  // empathy
  const Empathy: { [key: string]: string }[] = [
    { high: '高い' },
    { moderate: '普通' },
    { low: '低い' },
  ]

  const replaceAvatar = (characters: Character[]) => {
    const newCharacters = characters.map((character) => {
      const avatar = character.avatar
      if (avatar) {
        if (avatar.includes('localhost')) {
          character.avatar = avatar.replace('localhost', 'web')
        }
      }
      return character
    })

    return newCharacters
  }

  const setInitCustomCharacters = () => {
    if (customCharactersList.length > 0) {
      const customCharacterIds = customCharactersList.map(
        (customCharacter) => customCharacter.character_id,
      )
      const customCharacters = characters.filter((character) =>
        customCharacterIds.includes(character.id),
      )
      setCustomCharacters(replaceAvatar(customCharacters))
    }
  }

  const setInitUserCharacters = () => {
    if (userCharactersList.length > 0) {
      const userCharacterIds = userCharactersList.map(
        (userCharacter) => userCharacter.character_id,
      )
      // userCharactersをuserCharacterListでrole順（character1, character2）に並び替える
      const userCharacters = characters
        .filter((character) => userCharacterIds.includes(character.id))
        .sort((a, b) => {
          const aRole = userCharactersList.find(
            (userCharacter) => userCharacter.character_id === a.id,
          )?.role
          const bRole = userCharactersList.find(
            (userCharacter) => userCharacter.character_id === b.id,
          )?.role
          if (aRole === 'character1' && bRole === 'character2') {
            return -1
          }
          if (aRole === 'character2' && bRole === 'character1') {
            return 1
          }
          return 0
        })
      setUserCharacters(replaceAvatar(userCharacters))
    }
  }

  // ContextでStateを管理しているためコンポーネントがマウントされた時にStateを初期化する
  useEffect(() => {
    setSelectCharacter(null)
    setAvatarUrl('')
    setIsModalOpen(false)
    setIsEdit(false)
  }, [])

  const getInitData = async () => {
    if (token) {
      const charactersData = await getCharacters(token, 'all')
      const customCharactersData = await getCustomCharacters(token)
      const userCharactersData = await getUserCharacters(token, 'user')

      if (charactersData && customCharactersData && userCharactersData) {
        setCharacters(replaceAvatar(charactersData))
        setCustomCharactersList(customCharactersData)
        setUserCharactersList(userCharactersData.user_characters)
      }
    }
    setIsLoading(false)
  }

  const avatarReset = () => {
    setAvatarUrl('')
    setAvatar(null)
    setPreviewAvatar(null)
  }

  useEffect(() => {
    if (token) {
      void getInitData()
    }
  }, [token])

  useEffect(() => {
    setInitCustomCharacters()
    setInitUserCharacters()
  }, [characters, customCharactersList, userCharactersList])

  const handleCreateCharacter = (character: Character, avatar?: File) => {
    if (!token) return
    setIsLoading(true)
    setIsCreate(false)

    if (
      !character.name ||
      !character.mbti_type ||
      !character.tone ||
      !character.expression ||
      !character.values ||
      !character.empathy ||
      !character.first_person ||
      !character.second_person ||
      !avatar
    ) {
      setIsError(true)
      setErrorMessage('全ての項目を入力してください')
      setIsLoading(false)
      return
    } else {
      setIsError(false)
      setErrorMessage('')
    }

    if (isError) return

    void (async () => {
      try {
        const res = await createCharacter(token, character, avatar)
        if (res) {
          const replaceAvatarUrlCharacters = replaceAvatar(res.characters)
          if (res.character.avatar.includes('localhost')) {
            const replaceAvatarUrl = res.character.avatar.replace('localhost', 'web')
            const replaceAvatarUrlCharacter = {
              ...res.character,
              avatar: replaceAvatarUrl,
            }
            setSelectCharacter(replaceAvatarUrlCharacter)
          } else {
            setSelectCharacter(res.character)
          }
          setCharacters(replaceAvatarUrlCharacters)
        }
      } catch (error) {
        console.error('Error editing character', error)
      } finally {
        void getInitData()
        avatarReset()
      }
    })()
  }

  const handleCloseDetail = () => {
    setIsCreate(false)
    setIsModalOpen(false)
    avatarReset()
  }

  const handleUpdateCharacter = (character: Character, avatar?: File) => {
    // tokenが存在しない場合=ユーザーがログインしていない場合は何もしない
    if (!token) return
    setIsLoading(true)
    setIsEdit(false)

    void (async () => {
      try {
        const res = await editCharacter(token, character.id, character, avatar)
        if (res) {
          const replaceAvatarUrlCharacters = replaceAvatar(res.characters)
          if (res.character.avatar.includes('localhost')) {
            const replaceAvatarUrl = res.character.avatar.replace('localhost', 'web')
            const replaceAvatarUrlCharacter = {
              ...res.character,
              avatar: replaceAvatarUrl,
            }
            setSelectCharacter(replaceAvatarUrlCharacter)
          } else {
            setSelectCharacter(res.character)
          }
          setCharacters(replaceAvatarUrlCharacters)
        }
      } catch (error) {
        console.error('Error editing character', error)
      } finally {
        void getInitData()
        avatarReset()
      }
    })()
  }

  const handleUpdateUserCharacter = (userCharacterList: UserCharacter[]) => {
    if (!token) return
    userCharacterList.forEach((userCharacter) => {
      void (async () => {
        try {
          const res = await updateUserCharacter(token, userCharacter)
          setResUserCharacter((prev) => [...prev, res.user_character])
        } catch (error) {
          console.error('Error updating user_character', error)
        }
      })()
    })
  }

  const handleDeleteCharacter = (character: Character) => {
    if (!token) return
    // 削除されたキャラクターがuserCharactersListに存在する場合、
    // アプリが用意したキャラクター（ = customCharactersListでrole: :adminのもの）かつ、
    // userCharactersListに存在しないキャラクターを自動でuserCharactersListに追加する
    if (
      userCharactersList.find(
        (userCharacter) => userCharacter.character_id === character.id,
      )
    ) {
      // 削除されたキャラクターがuserCharactersListに存在する場合、
      // アプリが用意したキャラクター（ = customCharactersListでrole: :adminのもの）かつ、
      // userCharactersListに存在しないキャラクターを自動でuserCharactersListに追加する
      const addCharacterCandidates = customCharactersList.filter(
        (customCharacter) =>
          customCharacter.character_id !== character.id &&
          customCharacter.role === 'admin' &&
          !userCharactersList.find(
            (userCharacter) =>
              userCharacter.character_id === customCharacter.character_id,
          ),
      )
      console.log('userCharactersList', userCharactersList)
      console.log('addCharacterCandidates', addCharacterCandidates)
      const addCharacterData =
        addCharacterCandidates[Math.floor(Math.random() * addCharacterCandidates.length)]
      const addCharacter = characters.find(
        (character) => character.id === addCharacterData.character_id,
      )
      if (addCharacter) {
        const updatedUserCharacterList = userCharactersList.map((userCharacter) => {
          if (userCharacter.character_id === character.id) {
            return {
              ...userCharacter,
              character_id: addCharacter.id,
            }
          }
          return userCharacter
        })
        console.log('updatedUserCharacterList', updatedUserCharacterList)
        setUserCharactersList(updatedUserCharacterList)
        handleUpdateUserCharacter(updatedUserCharacterList)
      }
    }
    void (async () => {
      try {
        const res = await deleteCharacter(token, character.id)
        if (res) {
          setCharacters(replaceAvatar(res.characters))
        }
      } catch (error) {
        console.error('Error deleting character', error)
      } finally {
        void getInitData()
      }
    })()
  }

  useEffect(() => {
    if (resUserCharacter.length == 2) {
      setUserCharactersList(resUserCharacter)
      setResUserCharacter([])
    }
  }, [resUserCharacter])

  const handleSelectCharacter = (character: Character) => {
    setIsModalOpen(true)
    setSelectCharacter(character)
    setAvatarUrl(character.avatar)
  }

  const handleSelectCreateCharacter = () => {
    setIsCreate(true)
    setIsModalOpen(true)
  }

  const handleCancelSelectCharacter = () => {
    setIsModalOpen(false)
    setSelectCharacter(null)
  }

  const handleDropCharacter = (
    draggedCharacterId: number,
    droppedCharacterId: number,
  ) => {
    if (draggedCharacterId === droppedCharacterId) return
    // ドラッグされたキャラクターidがuserCharactersListに存在する場合、roleを更新する
    // その際に、ドロップされたキャラクターidのroleも更新する
    if (
      userCharactersList.find(
        (userCharacter) => userCharacter.character_id === draggedCharacterId,
      )
    ) {
      const droppedCharacterRole = userCharactersList.find(
        (userCharacter) => userCharacter.character_id === droppedCharacterId,
      )?.role
      const draggedCharacterRole = userCharactersList.find(
        (userCharacter) => userCharacter.character_id === draggedCharacterId,
      )?.role
      if (droppedCharacterRole && draggedCharacterRole) {
        const updatedUserCharacterList = userCharactersList.map((userCharacter) => {
          if (userCharacter.character_id === draggedCharacterId) {
            return { ...userCharacter, role: droppedCharacterRole }
          }
          if (userCharacter.character_id === droppedCharacterId) {
            return { ...userCharacter, role: draggedCharacterRole }
          }
          return userCharacter
        })
        setUserCharactersList(updatedUserCharacterList)
        handleUpdateUserCharacter(updatedUserCharacterList)
      }
    } else {
      const updatedUserCharacterList = userCharactersList.map((userCharacter) => {
        if (userCharacter.character_id === droppedCharacterId) {
          return { ...userCharacter, character_id: draggedCharacterId }
        }
        return userCharacter
      })
      setUserCharactersList(updatedUserCharacterList)
      handleUpdateUserCharacter(updatedUserCharacterList)
    }
  }

  const handleCheckMyCharacter = (e: React.ChangeEvent<HTMLInputElement>) => {
    // checkboxがチェックされた時に自作したキャラクターのみ表示する
    // 自作したキャラクターとは、customCharactersListでrole: :userのもの
    // つまりcustomCharactersListのstateをrole: :userのものに更新→Listに合わせてcustomCharactersを更新する
    if (e.target.checked) {
      const myCharacters = customCharactersList.filter(
        (customCharacter) => customCharacter.role === 'user',
      )
      const myCharacterIds = myCharacters.map(
        (customCharacter) => customCharacter.character_id,
      )
      const myCharactersData = characters.filter((character) =>
        myCharacterIds.includes(character.id),
      )
      setCustomCharacters(replaceAvatar(myCharactersData))
    } else {
      setInitCustomCharacters()
    }
  }

  return (
    <>
      <div className='flex flex-col items-center justify-start w-screen min-h-screen pt-[3rem]'>
        <MyPageMenu />
        {isLoading && <Loading />}
        {!isLoading && (
          <div className='flex flex-col items-start justify-start w-[70vw] h-full'>
            <div className='grid grid-cols-3 gap-4 p-4'>
              {userCharacters.map((character) => (
                <DroppableCharacter
                  key={character.id}
                  character={character}
                  userCharactersList={userCharactersList}
                  onDropCharacter={handleDropCharacter}
                  onSelect={handleSelectCharacter}
                />
              ))}
            </div>
            {/* ここから上を固定したい */}
            {/* スクロールした時にここから上のコンポーネントの裏に隠れる様にしたい */}
            <div className='w-full border mb-4 p-4'>
              キャラ1、キャラ2に設定したいキャラクターを下のリストからドラッグ＆ドロップしてください
            </div>
            <div className='flex flex-col items-center justify-between w-full p-4 border'>
              <div className='form-control'>
                <label className='cursor-pointer label'>
                  <span className='label-text mr-2'>自作したキャラクターのみ表示</span>
                  <input
                    type='checkbox'
                    className='checkbox checkbox-secondary'
                    onChange={(e) => handleCheckMyCharacter(e)}
                  />
                </label>
              </div>
              <div className='flex items-center justify-between w-full'>
                <CharacterList
                  characters={customCharacters}
                  charactersList={customCharactersList}
                  onSelect={handleSelectCharacter}
                  onCreate={handleSelectCreateCharacter}
                  onDelete={handleDeleteCharacter}
                />
              </div>
            </div>
            {selectCharacter && token && (
              <CharacterDetailModal
                onClose={handleCancelSelectCharacter}
                onUpdateCharacter={handleUpdateCharacter}
                MBTI_Type={MBTI_Type}
                Tone={Tone}
                Expression={Expression}
                Empathy={Empathy}
              />
            )}
          </div>
        )}
        {/* キャラクターを作成する画面 */}
        {isCreate && (
          <CreateCharacter
            onClose={handleCloseDetail}
            onCreateCharacter={handleCreateCharacter}
            MBTI_Type={MBTI_Type}
            Tone={Tone}
            Expression={Expression}
            Empathy={Empathy}
            errorMessage={errorMessage}
          />
        )}
      </div>
    </>
  )
}

export default function MyPageCharacters() {
  return (
    <DndProvider backend={HTML5Backend}>
      <MyPageCharactersContent />
    </DndProvider>
  )
}
