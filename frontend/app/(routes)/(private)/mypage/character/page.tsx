/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

import { Loading } from '@/app/_components/layouts/loading/layout'
import { CharacterDetailModal } from '@/app/_components/mypage/CharacterDetailModal'
import { CharacterList } from '@/app/_components/mypage/CharacterList'
import { CreateCharacter } from '@/app/_components/mypage/CreateCharacter'
import { MyPageMenu } from '@/app/_components/mypage/MyPageMenu'
import { useCharacterList } from '@/app/_contexts/CharacterListContext'
import { useDecisions } from '@/app/_contexts/DecisionsContext'
import {
  getCharacters,
  getUserCharacters,
  getCustomCharacters,
  editCharacter,
} from '@/app/_features/fetchAPI'
import { Character, CustomCharacter, UserCharacter } from '@/app/_types'

export default function MyPageDecisions() {
  // CurrentUserが使用するキャラクターを選択する
  // APIから取得する情報
  const { characters, setCharacters } = useCharacterList()
  const { customCharactersList, setCustomCharactersList } = useCharacterList()
  const { userCharactersList, setUserCharactersList } = useCharacterList()
  const { customCharacters, setCustomCharacters } = useCharacterList()
  const { userCharacters, setUserCharacters } = useCharacterList()
  const { selectCharacter, setSelectCharacter } = useCharacterList()
  const { avatarUrl, setAvatarUrl } = useCharacterList()

  const { isCreate, setIsCreate } = useCharacterList()
  const { isEdit, setIsEdit } = useCharacterList()

  const { setIsModalOpen } = useDecisions()
  const { isLoading } = useDecisions()
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

  // ContextでStateを管理しているためコンポーネントがマウントされた時にStateを初期化する
  useEffect(() => {
    setSelectCharacter(null)
    setAvatarUrl('')
    setIsEdit(false)
  }, [])

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
    setIsCreate(true)
    setIsModalOpen(true)
  }

  const handleCloseDetail = () => {
    setIsCreate(false)
    setIsModalOpen(false)
  }

  const handleUpdateCharacter = (character: Character, avatar?: File) => {
    // tokenが存在しない場合=ユーザーがログインしていない場合は何もしない
    if (!token) return

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
        setIsEdit(false)
      }
    })()
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
    setAvatarUrl(character.avatar)
  }

  return (
    <>
      <div className='flex flex-col items-center justify-start w-screen min-h-screen pt-[3rem]'>
        <MyPageMenu />
        {isLoading && <Loading />}
        {!isLoading && !isCreate && (
          <div className='flex items-start justify-start w-[70vw] h-full border'>
            <CharacterList
              characters={customCharacters}
              onSelect={handleSelectCharacter}
            />
            {selectCharacter && token && (
              <CharacterDetailModal
                onClose={() => setSelectCharacter(null)}
                onUpdateCharacter={handleUpdateCharacter}
              />
            )}
          </div>
        )}
        {/* キャラクターを作成する画面 */}
        {isCreate && <CreateCharacter handleCloseDetail={handleCloseDetail} />}
      </div>
    </>
  )
}