import axios from 'axios'

import { Character, DecisionCharacter, UserCharacter } from '@/app/_types'

const defaultHeaders = (token: string) => {
  return {
    'X-Requested-With': 'XMLHttpRequest',
    Authorization: `Bearer ${token}`,
  }
}

interface DecisionCharacterResponse {
  decision_characters: DecisionCharacter[]
  characterData: Character[]
}

interface getDecisionCharacterResponse {
  decisionCharacters: DecisionCharacter[]
  characterData: Character[]
}

const getDecisionCharacters = async (
  token: string,
  decisionId?: number,
): Promise<getDecisionCharacterResponse> => {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/decision_characters`
    const response = await axios<DecisionCharacterResponse>(url, {
      headers: defaultHeaders(token),
      params: { decision_id: decisionId },
      withCredentials: true,
    })
    if (response.status === 200) {
      return {
        decisionCharacters: response.data.decision_characters,
        characterData: response.data.characterData,
      }
    } else {
      throw new Error('Failed to fetch characters')
    }
  } catch (error) {
    console.error('Error fetching characters', error)
    throw error
  }
}

const createDecisionCharacter = async (
  token: string,
  decisionId: number,
  userCharacters: UserCharacter[],
) => {
  try {
    const response = await axios<DecisionCharacterResponse>({
      method: 'post',
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/decision_characters`,
      headers: defaultHeaders(token),
      data: { decision_id: decisionId, user_characters: userCharacters },
      withCredentials: true,
    })
    if (response.status === 200) {
      return {
        decisionCharacters: response.data.characterData,
      }
    } else {
      throw new Error('Failed to create character')
    }
  } catch (error) {
    console.error('Error creating character', error)
    throw error
  }
}

export { getDecisionCharacters, createDecisionCharacter }
