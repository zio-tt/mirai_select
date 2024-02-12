import { useState, createContext, useContext } from 'react'

import { User, Character } from '@/app/_types'

import { useHelperInitData } from '../_hooks/_helper/useHelperInitData'

interface CharacterResponse {
  id: number
  conversation_id: number
  character_id?: number
  response: string
}

type HelperContextType = {
  currentUser: User | undefined
  setCurrentUser: React.Dispatch<React.SetStateAction<User | undefined>>
  userCharacters: Character[] | undefined
  setUserCharacters: React.Dispatch<React.SetStateAction<Character[] | undefined>>
  queryText: string
  setQueryText: React.Dispatch<React.SetStateAction<string>>
  beforeQueryText: string
  setBeforeQueryText: React.Dispatch<React.SetStateAction<string>>
  userDecision: CharacterResponse | undefined
  setUserDecision: React.Dispatch<React.SetStateAction<CharacterResponse | undefined>>
  beforeUserDecision: CharacterResponse | undefined
  setBeforeUserDecision: React.Dispatch<
    React.SetStateAction<CharacterResponse | undefined>
  >
  conversationCount: number
  setConversationCount: React.Dispatch<React.SetStateAction<number>>
  remainingTokens: number
  setRemainingTokens: React.Dispatch<React.SetStateAction<number>>
  inputTags: string
  setInputTags: React.Dispatch<React.SetStateAction<string>>
  displayTags: string[]
  setDisplayTags: React.Dispatch<React.SetStateAction<string[]>>
  labelBgColor: string
  setLabelBgColor: React.Dispatch<React.SetStateAction<string>>
  labelTextColor: string
  setLabelTextColor: React.Dispatch<React.SetStateAction<string>>
  tagAlert: string[]
  setTagAlert: React.Dispatch<React.SetStateAction<string[]>>
  isClickInformation: boolean
  setIsClickInformation: React.Dispatch<React.SetStateAction<boolean>>
  isSaveDecision: boolean
  setIsSaveDecision: React.Dispatch<React.SetStateAction<boolean>>
  fetchHelperInitData: (token: string) => Promise<void>
}

type ChildrenType = {
  children: React.ReactNode
}

const HelperContext = createContext<HelperContextType | null>(null)

export const useHelper = () => {
  const context = useContext(HelperContext)
  if (!context) {
    throw new Error('useHelper must be used within a HelperProvider')
  }
  return context
}

export const HelperProvider = ({ children }: ChildrenType) => {
  const { currentUser, setCurrentUser } = useHelperInitData()
  const { userCharacters, setUserCharacters } = useHelperInitData()
  const [queryText, setQueryText] = useState<string>('')
  const [beforeQueryText, setBeforeQueryText] = useState<string>('')
  const [userDecision, setUserDecision] = useState<CharacterResponse>()
  const [beforeUserDecision, setBeforeUserDecision] = useState<CharacterResponse>()
  const [remainingTokens, setRemainingTokens] = useState<number>(0)
  const [conversationCount, setConversationCount] = useState<number>(0)
  const [inputTags, setInputTags] = useState<string>('')
  const [displayTags, setDisplayTags] = useState<string[]>([])
  const [labelBgColor, setLabelBgColor] = useState<string>('bg-blue-100')
  const [labelTextColor, setLabelTextColor] = useState<string>('text-blue-800')
  const [tagAlert, setTagAlert] = useState<string[]>([])
  const [isClickInformation, setIsClickInformation] = useState(false)
  const [isSaveDecision, setIsSaveDecision] = useState<boolean>(false)
  const { fetchHelperInitData } = useHelperInitData()

  return (
    <HelperContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        userCharacters,
        setUserCharacters,
        queryText,
        setQueryText,
        beforeQueryText,
        setBeforeQueryText,
        userDecision,
        setUserDecision,
        beforeUserDecision,
        setBeforeUserDecision,
        remainingTokens,
        setRemainingTokens,
        conversationCount,
        setConversationCount,
        inputTags,
        setInputTags,
        displayTags,
        setDisplayTags,
        labelBgColor,
        setLabelBgColor,
        labelTextColor,
        setLabelTextColor,
        tagAlert,
        setTagAlert,
        isClickInformation,
        setIsClickInformation,
        isSaveDecision,
        setIsSaveDecision,
        fetchHelperInitData,
      }}
    >
      {children}
    </HelperContext.Provider>
  )
}
