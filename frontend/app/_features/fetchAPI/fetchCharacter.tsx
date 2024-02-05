import axios from 'axios'

import { Character } from '@/app/_types'

const defaultHeaders = (token: string) => {
  return {
    'X-Requested-With': 'XMLHttpRequest',
    Authorization: `Bearer ${token}`,
  }
}

interface CharacterResponse {
  characters: Character[]
}

const getCharacters = async (
  token: string,
  condition: string,
  decisionId?: number,
): Promise<Character[]> => {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/characters`
    const response = await axios<CharacterResponse>(url, {
      headers: defaultHeaders(token),
      params: { condition, decisionId },
      withCredentials: true,
    })
    if (response.status === 200) {
      return response.data.characters
    } else {
      throw new Error('Failed to fetch characters')
    }
  } catch (error) {
    console.error('Error fetching characters', error)
    throw error
  }
}

const createCharacter = async (token: string) => {
  try {
    const response = await axios<CharacterResponse>({
      method: 'post',
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/characters`,
      headers: defaultHeaders(token),
      withCredentials: true,
    })
    if (response.status === 200) {
      return response.data.characters
    } else {
      throw new Error('Failed to create character')
    }
  } catch (error) {
    console.error('Error creating character', error)
    throw error
  }
}

const deleteCharacter = async (token: string, id: string) => {
  try {
    const response = await axios<CharacterResponse>({
      method: 'delete',
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/characters/${id}`,
      headers: defaultHeaders(token),
      withCredentials: true,
    })
    if (response.status === 200) {
      return response.data.characters
    } else {
      throw new Error('Failed to delete character')
    }
  } catch (error) {
    console.error('Error deleting character', error)
    throw error
  }
}

const editCharacter = async (token: string, id: string) => {
  try {
    const response = await axios<CharacterResponse>({
      method: 'put',
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/characters/${id}`,
      headers: defaultHeaders(token),
      withCredentials: true,
    })
    if (response.status === 200) {
      return response.data.characters
    } else {
      throw new Error('Failed to edit character')
    }
  } catch (error) {
    console.error('Error editing character', error)
    throw error
  }
}

export { getCharacters, createCharacter, deleteCharacter, editCharacter }
