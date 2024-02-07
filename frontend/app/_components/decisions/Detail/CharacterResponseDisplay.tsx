import Image from 'next/image'
import { useState, useEffect } from 'react'

import { Character } from '@/app/_types'

interface CharacterResponse {
  id: number
  conversation_id: number
  character_id?: number
  response: string
}

interface CharacterResponseDisplayProps {
  decisionCharacter: Character
  characterResponse: CharacterResponse
  userDecision: number
}

const CharacterResponseDisplay = ({
  decisionCharacter,
  characterResponse,
  userDecision,
}: CharacterResponseDisplayProps) => {
  const [isUserDecision, setIsUserDecision] = useState<boolean>(false)
  const [avatarURL, setAvatarURL] = useState<string>('/images/logo.png')

  useEffect(() => {
    const avatar = decisionCharacter.avatar
    if (avatar) {
      if (avatar.includes('localhost')) {
        setAvatarURL(avatar.replace('localhost', 'web'))
      } else {
        setAvatarURL(avatar)
      }
    }

    if (characterResponse.id === userDecision) {
      setIsUserDecision(true)
    }
  }, [decisionCharacter, characterResponse, userDecision])

  return (
    <div className='chat chat-start'>
      <div
        className={`w-10 rounded-full chat-image avatar mr-2 p-1 ${isUserDecision ? 'ring ring-secondary ring-offset-1' : 'ring ring-primary ring-offset-1'} `}
      >
        <Image
          alt={decisionCharacter.name}
          src={avatarURL}
          width={30}
          height={30}
          className='rounded-full'
        />
      </div>
      <div className='chat-header'>{decisionCharacter.name}</div>
      <div
        className={`chat-bubble ${isUserDecision ? 'chat-bubble-secondary' : 'chat-bubble-primary'}`}
      >
        {characterResponse.response}
      </div>
      {isUserDecision && (
        <div className='chat-footer opacity-50'>ユーザーが選択した選択肢</div>
      )}
    </div>
  )
}

export { CharacterResponseDisplay }
