/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'

import { CharacterDetailModal } from '@/app/_components/mypage/CharacterDetailModal'
import { CharacterList } from '@/app/_components/mypage/CharacterList'
import { CreateCharacter } from '@/app/_components/mypage/CreateCharacter'
import { MyPageMenu } from '@/app/_components/mypage/MyPageMenu'
import { useDecisions } from '@/app/_contexts/DecisionsContext'
import {
  getCharacters,
  getUserCharacters,
  getCustomCharacters,
} from '@/app/_features/fetchAPI'
import { Character, CustomCharacter, UserCharacter } from '@/app/_types'

export default function MyPageDecisions() {
  // CurrentUserが使用するキャラクターを選択する
  // APIから取得する情報
  // characters: 全キャラクターの詳細情報リスト
  // customCharactersList: ユーザーが使用可能なキャラクターの作成者リスト
  // userCharactersList: ユーザーが現在使用するキャラクターに指定しているキャラクターリスト
  const [characters, setCharacters] = useState<Character[]>([])
  const [customCharactersList, setCustomCharactersList] = useState<CustomCharacter[]>([])
  const [userCharactersList, setUserCharactersList] = useState<UserCharacter[]>([])

  // 上記とは別でStateとして用意する情報
  // selectCharacter: 情報を表示・編集するキャラクター
  // customCharacters: ユーザーが使用可能なキャラクターのリスト
  // userCharacters: ユーザーが現在使用するキャラクターのリスト
  const [selectCharacter, setSelectCharacter] = useState<Character | null>(null)
  const [customCharacters, setCustomCharacters] = useState<Character[]>([])
  const [userCharacters, setUserCharacters] = useState<Character[]>([])

  const [isCreateCharacter, setIsCreateCharacter] = useState<boolean>(false)
  const { setIsModalOpen } = useDecisions()
  const { data: session } = useSession()
  const token = session?.appAccessToken

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
      const userCharacters = characters.filter((character) =>
        userCharacterIds.includes(character.id),
      )
      setUserCharacters(replaceAvatar(userCharacters))
    }
  }

  useEffect(() => {
    if (token) {
      void (async () => {
        const charactersData = await getCharacters(token, 'all')
        const customCharactersData = await getCustomCharacters(token)
        const userCharactersData = await getUserCharacters(token, 'user')

        if (charactersData && customCharactersData && userCharactersData) {
          setCharacters(replaceAvatar(charactersData))
          setCustomCharactersList(customCharactersData)
          setUserCharactersList(userCharactersData.user_characters)
        }
      })()
    }
  }, [token])

  useEffect(() => {
    setInitCustomCharacters()
    setInitUserCharacters()
  }, [characters, customCharactersList, userCharactersList])

  const handleCreateCharacter = () => {
    setIsCreateCharacter(true)
    setIsModalOpen(true)
  }

  const handleCloseDetail = () => {
    setIsCreateCharacter(false)
    setIsModalOpen(false)
  }

  {
    /* キャラクターの情報
    name: string
    mbti_type: string
    tone: string
    first_person: string
    second_person: string
    expression: string
    values: string
    empathy: string
    character1_welcome: string
    character2_welcome: string
    avatar: string
  */
  }

  const handleSelectCharacter = (character: Character) => {
    setIsModalOpen(true)
    setSelectCharacter(character)
  }

  return (
    <>
      <div className='flex flex-col items-center justify-start w-screen min-h-screen pt-[3rem]'>
        <MyPageMenu />
        <div className='flex items-start justify-start w-[70vw] h-full border'>
          <CharacterList characters={customCharacters} onSelect={handleSelectCharacter} />
          {selectCharacter && token && (
            <CharacterDetailModal
              token={token}
              replaceAvatar={replaceAvatar}
              character={selectCharacter}
              characters={characters}
              setCharacters={setCharacters}
              onClose={() => setSelectCharacter(null)}
            />
          )}
        </div>
        {/* キャラクターを作成する画面 */}
        {isCreateCharacter && <CreateCharacter handleCloseDetail={handleCloseDetail} />}
      </div>
    </>
  )
}
