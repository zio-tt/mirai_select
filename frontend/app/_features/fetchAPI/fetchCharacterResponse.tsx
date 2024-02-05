import axios from 'axios'

const defaultHeaders = (token: string) => {
  return {
    'X-Requested-With': 'XMLHttpRequest',
    Authorization: `Bearer ${token}`,
  }
}

interface CharacterResponse {
  id: number
  conversation_id: number
  character_id?: number
  response: string
}

interface CharacterResponses {
  character_responses: CharacterResponse[]
}

const getCharacterResponses = async (
  token: string,
  decisionId: number,
): Promise<CharacterResponse[]> => {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/character_responses`
    const response = await axios.get<CharacterResponses>(url, {
      headers: defaultHeaders(token),
      params: { decisionId },
      withCredentials: true,
    })
    if (response.status === 200) {
      return response.data.character_responses
    } else {
      throw new Error('Failed to fetch character_responses')
    }
  } catch (error) {
    console.error('Error fetching character_responses', error)
    throw error
  }
}

const createCharacterResponses = async (
  token: string,
  parsedResponse: CharacterResponse[],
) => {
  try {
    const response = await axios<CharacterResponses>({
      method: 'post',
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/character_responses`,
      headers: defaultHeaders(token),
      data: { parsedResponse },
      withCredentials: true,
    })
    if (response.status === 200) {
      return response.data.character_responses
    }
  } catch (error) {
    console.error('Error creating character_response', error)
  }
}

export { getCharacterResponses, createCharacterResponses }
