import { useState, createContext, useContext } from 'react'

import { Character, CustomCharacter, UserCharacter } from '@/app/_types'

type CharacterListContextType = {
  isEdit: boolean
  setIsEdit: (isEdit: boolean) => void
  avatar: File | null
  setAvatar: (avatar: File | null) => void
  previewAvatar: File | null
  setPreviewAvatar: (previewAvatar: File | null) => void
  avatarUrl: string
  setAvatarUrl: (avatarUrl: string) => void
  isCreate: boolean
  setIsCreate: (isCreate: boolean) => void
  characters: Character[]
  setCharacters: (characters: Character[]) => void
  customCharactersList: CustomCharacter[]
  setCustomCharactersList: (customCharactersList: CustomCharacter[]) => void
  userCharactersList: UserCharacter[]
  setUserCharactersList: (userCharactersList: UserCharacter[]) => void
  selectCharacter: Character | null
  setSelectCharacter: (character: Character | null) => void
  customCharacters: Character[]
  setCustomCharacters: (characters: Character[]) => void
  userCharacters: Character[]
  setUserCharacters: (characters: Character[]) => void
}

type ChildrenType = {
  children: React.ReactNode
}

const CharacterListContext = createContext<CharacterListContextType | null>(null)

export const useCharacterList = () => {
  const context = useContext(CharacterListContext)
  if (!context) {
    throw new Error('useCharacterList must be used within a CharacterListProvider')
  }
  return context
}

export const CharacterListProvider = ({ children }: ChildrenType) => {
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [isCreate, setIsCreate] = useState<boolean>(false)
  // characters: 全キャラクターの詳細情報リスト
  // customCharactersList: ユーザーが使用可能なキャラクターの作成者リスト
  // userCharactersList: ユーザーが現在使用するキャラクターに指定しているキャラクターリスト
  // selectCharacter: 情報を表示・編集するキャラクター
  // customCharacters: ユーザーが使用可能なキャラクターのリスト
  // userCharacters: ユーザーが現在使用するキャラクターのリスト
  const [characters, setCharacters] = useState<Character[]>([])
  const [customCharactersList, setCustomCharactersList] = useState<CustomCharacter[]>([])
  const [userCharactersList, setUserCharactersList] = useState<UserCharacter[]>([])
  const [selectCharacter, setSelectCharacter] = useState<Character | null>(null)
  const [customCharacters, setCustomCharacters] = useState<Character[]>([])
  const [userCharacters, setUserCharacters] = useState<Character[]>([])

  const [avatar, setAvatar] = useState<File | null>(null)
  const [previewAvatar, setPreviewAvatar] = useState<File | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string>('')

  return (
    <CharacterListContext.Provider
      value={{
        isEdit,
        setIsEdit,
        isCreate,
        setIsCreate,
        avatar,
        setAvatar,
        previewAvatar,
        setPreviewAvatar,
        avatarUrl,
        setAvatarUrl,
        characters,
        setCharacters,
        customCharactersList,
        setCustomCharactersList,
        userCharactersList,
        setUserCharactersList,
        selectCharacter,
        setSelectCharacter,
        customCharacters,
        setCustomCharacters,
        userCharacters,
        setUserCharacters,
      }}
    >
      {children}
    </CharacterListContext.Provider>
  )
}
