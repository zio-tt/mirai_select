import Image from 'next/image'
import { useState, useEffect } from 'react'

import { User } from '@/app/_types'

interface UserQueryDisplayProps {
  decisionUser: User
  queryText: string
}

const UserQueryDisplay = ({ decisionUser, queryText }: UserQueryDisplayProps) => {
  const [avatarURL, setAvatarURL] = useState<string>('/images/logo.png')

  useEffect(() => {
    if (decisionUser.avatar) {
      setAvatarURL(decisionUser.avatar)
    }
  }, [decisionUser.avatar])

  return (
    <div className='chat chat-start mb-2'>
      <div className='chat-image avatar w-10 rounded-full ring ring-accent ring-offset-1 mr-2 p-1'>
        <Image
          alt={decisionUser.id.toString()}
          src={avatarURL}
          width={30}
          height={30}
          className='rounded-full'
        />
      </div>
      <div className='chat-bubble chat-bubble-accent'>{queryText}</div>
    </div>
  )
}

export { UserQueryDisplay }
