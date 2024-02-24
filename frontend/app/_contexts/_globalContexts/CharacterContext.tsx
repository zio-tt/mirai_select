import { useState, createContext, useContext } from 'react'

import { Character } from '@/app/_types'

type CharacterContextType = {
  characters: Character[]
  setCharacters: (characters: Character[]) => void
  customCharacters: Character[]
  setCustomCharacters: (characters: Character[]) => void
  userCharacters: Character[]
  setUserCharacters: (characters: Character[]) => void
}

type ChildrenType = {
  children: React.ReactNode
}

const CharacterContext = createContext<CharacterContextType | null>(null)

export const useCharacter = () => {
  const context = useContext(CharacterContext)
  if (!context) {
    throw new Error('useCharacter must be used within a CharacterProvider')
  }
  return context
}

export const CharacterProvider = ({ children }: ChildrenType) => {
  // characters: 全キャラクターの詳細情報リスト
  // customCharactersList: ユーザーが使用可能なキャラクターの作成者リスト
  // userCharactersList: ユーザーが現在使用するキャラクターに指定しているキャラクターリスト
  // selectCharacter: 情報を表示・編集するキャラクター
  // customCharacters: ユーザーが使用可能なキャラクターのリスト
  // userCharacters: ユーザーが現在使用するキャラクターのリスト
  const [characters, setCharacters] = useState<Character[]>([])
  const [customCharacters, setCustomCharacters] = useState<Character[]>([])
  const [userCharacters, setUserCharacters] = useState<Character[]>([])

  return (
    <CharacterContext.Provider
      value={{
        characters,
        setCharacters,
        customCharacters,
        setCustomCharacters,
        userCharacters,
        setUserCharacters,
      }}
    >
      {children}
    </CharacterContext.Provider>
  )
}
