import Image from 'next/image'
import { useState, useEffect } from 'react'

import { useDrawer } from '@/app/_contexts/DrawerContext'
import { Character } from '@/app/_types'

interface CharacterResponse {
  id: number
  conversation_id: number
  character_id?: number
  response: string
}

interface CharacterResponseDisplayProps {
  decisionCharacter: Character
  characterResponse: CharacterResponse | null
  conversationId?: number
  userDecision?: CharacterResponse
  setUserDecision: React.Dispatch<React.SetStateAction<CharacterResponse | undefined>>
  isResponse: boolean
  welcome?: string
}

const CharacterResponseDisplay = ({
  decisionCharacter,
  characterResponse,
  conversationId,
  userDecision,
  setUserDecision,
  isResponse,
  welcome,
}: CharacterResponseDisplayProps) => {
  const [avatarURL, setAvatarURL] = useState<string>('/images/logo.png')
  const [isSelected, setIsSelected] = useState<boolean>(false)
  const [isAnySelected, setIsAnySelected] = useState<boolean>(false)
  const [chatStyle, setChatStyle] = useState<string>('chat-bubble chat-bubble-primary')
  const { isDrawerClick } = useDrawer()

  useEffect(() => {
    const avatar = decisionCharacter.avatar
    if (avatar) {
      if (avatar.includes('localhost')) {
        setAvatarURL(avatar.replace('localhost', 'web'))
      } else {
        setAvatarURL(avatar)
      }
    }
  }, [decisionCharacter])

  useEffect(() => {
    if (isResponse && isSelected) {
      setChatStyle('chat-bubble chat-bubble-secondary')
    } else if (isResponse && !isSelected) {
      setChatStyle('chat-bubble chat-bubble-primary')
    }
  }, [isSelected, isResponse])

  useEffect(() => {
    if (isDrawerClick && conversationId) {
      setUserDecision({
        id: 0,
        conversation_id: conversationId,
        character_id: undefined,
        response: '',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDrawerClick])

  useEffect(() => {
    if (userDecision && characterResponse) {
      setIsSelected(userDecision.character_id === characterResponse?.character_id)
      setIsAnySelected(userDecision.character_id !== undefined)
    }
  }, [userDecision, characterResponse])

  const handleCharacterClick = () => {
    if (isResponse && conversationId && characterResponse) {
      setUserDecision({
        id: 0,
        conversation_id: conversationId,
        character_id: characterResponse.character_id,
        response: characterResponse.response,
      })
    }
  }

  return (
    <div className='chat chat-start w-[90%] mb-3' onClick={handleCharacterClick}>
      <div
        className={`w-20 rounded-full chat-image avatar mr-2 p-1 ring ring-primary ring-offset-1 ${isResponse && isAnySelected ? (isSelected ? 'bg-white' : 'bg-gray-600') : ''}`}
      >
        <Image
          alt={decisionCharacter.name}
          src={avatarURL}
          width={30}
          height={30}
          className='rounded-full'
        />
      </div>
      <div
        className={`chat-header ${isResponse && isAnySelected ? (isSelected ? 'font-bold' : '') : ''}`}
      >
        {decisionCharacter.name}
      </div>
      <div className={chatStyle}>
        {characterResponse ? characterResponse.response : welcome}
      </div>
      {isResponse && isSelected && <div className='chat-footer'>選択している返答</div>}
    </div>
  )
}

export { CharacterResponseDisplay }
