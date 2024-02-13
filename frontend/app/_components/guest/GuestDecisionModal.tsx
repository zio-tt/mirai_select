import axios from 'axios'
import CryptoJS from 'crypto-js'
import { useState, useEffect } from 'react'

import { Decision, Conversation, Character, Comment, User } from '@/app/_types'

import { GuestCommentsDisplay } from './GuestCommentDisplay'
import { GuestDecisionDetail } from './GuestDecisionDetail'

interface CharacterResponse {
  id: number
  conversation_id: number
  character_id?: number
  response: string
}

interface DecisionModalProps {
  decision: Decision
  conversations: Conversation[]
  decisionComments: Comment[] // この行を追加
  handleCloseDetail: () => void
}

const GuestDecisionModal = ({
  decision,
  conversations,
  decisionComments,
  handleCloseDetail,
}: DecisionModalProps) => {
  // page.tsxと同じ様にdecisionCharactersとcharacterResponsesを取得する
  const [users, setUsers] = useState<User[]>([])
  const [decisionUser, setDecisionUser] = useState<User | null>(null)
  const [decisionCharacters, setDecisionCharacters] = useState<Character[]>([])
  const [characterResponses, setCharacterResponses] = useState<CharacterResponse[]>([])

  const encryptToken = (token: string) => {
    const secretKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY
    const key = CryptoJS.enc.Utf8.parse(secretKey!)
    const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(token), key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    })
    return encrypted.toString()
  }

  interface ResponseData {
    users: User[]
    decision_characters: Character[]
    character_responses: CharacterResponse[]
  }

  const fetchApiData = async (contentType: string) => {
    try {
      const token = process.env.NEXT_PUBLIC_ENCRYPTION_TOKEN
      const encryptedToken = encryptToken(token!)
      const url = `${process.env.NEXT_PUBLIC_API_URL}/guest/${contentType}`
      const decisionId = decision.id
      const response = await axios.get<ResponseData>(url, {
        headers: {
          Authorization: `Bearer ${encryptedToken}`,
          'X-Requested-With': 'XMLHttpRequest',
        },
        params: { decisionId },
        withCredentials: true,
      })
      switch (contentType) {
        case 'users':
          setUsers(response.data.users)
          setDecisionUser(
            response.data.users.find((user) => user.id === decision.user_id) || null,
          )
          break
        case 'decision_characters':
          setDecisionCharacters(response.data.decision_characters)
          break
        case 'character_responses':
          setCharacterResponses(response.data.character_responses)
          break
        default:
          console.error('Invalid contentType')
      }
    } catch (error) {
      console.error('Error fetching data', error)
    }
  }

  useEffect(() => {
    void (async () => {
      try {
        await fetchApiData('users')
        await fetchApiData('decision_characters')
        await fetchApiData('character_responses')
      } catch (error) {
        console.error(error)
      }
    })()
    
  }, [])

  // モーダルのコンテンツをクリックしたときにイベントの伝播を止める
  const handleModalContentClick = (event: React.MouseEvent) => {
    event.stopPropagation()
  }

  if (!decisionUser || !decisionCharacters || !characterResponses || !users) {
    return null
  } else {
    return (
      <>
        <div className='fixed inset-0 flex items-center justify-center z-40'>
          <div className='fixed inset-0 bg-black bg-opacity-50 z-60' />
          {/* ここをクリックしても何も起きないようにstopPropagationを呼び出す */}
          <div
            className='fixed flex w-full h-full items-center justify-center z-50'
            onClick={handleCloseDetail}
          >
            <div
              className='flex flex-col w-[50%] h-[80%] bg-white p-5 rounded-lg items-center mr-2'
              onClick={handleModalContentClick}
            >
              <div className='flex h-full w-full justify-center items-center'>
                <GuestDecisionDetail
                  conversations={conversations.filter(
                    (conversation) => conversation.decision_id === decision.id,
                  )}
                  decisionUser={users.find((user) => user.id === decision.user_id)!}
                  decisionCharacters={decisionCharacters}
                  characterResponses={characterResponses}
                />
              </div>
            </div>
            <div
              className='flex flex-col w-[30%] h-[80%] bg-white py-5 rounded-lg items-center ml-4'
              onClick={handleModalContentClick}
            >
              <div className='flex flex-col w-full h-full justify-between'>
                <GuestCommentsDisplay users={users} decisionComments={decisionComments} />
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
}

export { GuestDecisionModal }
