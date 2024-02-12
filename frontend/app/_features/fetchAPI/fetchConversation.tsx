import axios from 'axios'

import { Conversation } from '@/app/_types'

const defaultHeaders = (token: string) => {
  return {
    'X-Requested-With': 'XMLHttpRequest',
    Authorization: `Bearer ${token}`,
  }
}

interface CharacterResponse {
  conversation_id: number
  character_id?: number
  response: string
}

interface ConversationResponse {
  conversation: Conversation
}

interface ConversationsResponse {
  conversations: Conversation[]
}

const getConversations = async ({
  token,
  decisionId,
  condition,
}: {
  token: string
  decisionId?: number
  condition?: string
}): Promise<Conversation[]> => {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/conversations`
    const response = await axios<ConversationsResponse>(url, {
      headers: defaultHeaders(token),
      params: { decisionId, condition },
      withCredentials: true,
    })
    if (response.status === 200) {
      return response.data.conversations
    } else {
      throw new Error('Failed to fetch conversations')
    }
  } catch (error) {
    console.error('Error fetching conversations', error)
    throw error
  }
}

const createConversation = async (
  token: string,
  decisionId: number,
  queryText: string,
) => {
  try {
    const response = await axios<ConversationResponse>({
      method: 'post',
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/conversations`,
      headers: defaultHeaders(token),
      data: { decisionId, queryText },
      withCredentials: true,
    })
    if (response.status === 200) {
      return response.data.conversation
    } else {
      throw new Error('Failed to create conversation')
    }
  } catch (error) {
    console.error('Error creating conversation', error)
    throw error
  }
}

const updateConversation = async (
  token: string,
  id: number,
  queryText: string,
  userDecision: CharacterResponse,
) => {
  try {
    const response = await axios<ConversationResponse>({
      method: 'put',
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/conversations/${id}`,
      headers: defaultHeaders(token),
      data: { queryText, userDecision },
      withCredentials: true,
    })
    if (response.status === 200) {
      return response.data.conversation
    } else {
      throw new Error('Failed to update conversation')
    }
  } catch (error) {
    console.error('Error editing conversation', error)
    throw error
  }
}

export { getConversations, createConversation, updateConversation }
