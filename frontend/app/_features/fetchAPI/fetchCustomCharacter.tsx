import axios from 'axios'

import { CustomCharacter } from '@/app/_types'

const defaultHeaders = (token: string) => {
  return {
    'X-Requested-With': 'XMLHttpRequest',
    Authorization: `Bearer ${token}`,
  }
}

interface CustomCharacterProps {
  custom_characters: CustomCharacter[]
}

const getCustomCharacters = async (
  token: string,
  condition?: string,
): Promise<CustomCharacter[]> => {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/custom_characters`
    const response = await axios.get<CustomCharacterProps>(url, {
      headers: defaultHeaders(token),
      params: { condition },
      withCredentials: true,
    })
    if (response.status === 200) {
      return response.data.custom_characters
    } else {
      throw new Error('Failed to fetch user_characters')
    }
  } catch (error) {
    console.error('Error fetching user_characters', error)
    throw error
  }
}

export { getCustomCharacters }
