import axios from 'axios'

import { Character } from '@/app/_types'

const defaultHeaders = (token: string) => {
  return {
    'X-Requested-With': 'XMLHttpRequest',
    Authorization: `Bearer ${token}`,
  }
}

interface CharacterResponse {
  character: Character
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

const createCharacter = async (token: string, character: Character, avatar?: File) => {
  const formData = new FormData()
  formData.append('character[name]', character.name)
  formData.append('character[mbti_type]', character.mbti_type)
  formData.append('character[tone]', character.tone)
  formData.append('character[first_person]', character.first_person)
  formData.append('character[second_person]', character.second_person)
  formData.append('character[expression]', character.expression)
  formData.append('character[values]', character.values)
  formData.append('character[empathy]', character.empathy)
  if (avatar) {
    formData.append('avatar', avatar)
  }
  try {
    const response = await axios<CharacterResponse>({
      method: 'post',
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/characters`,
      headers: defaultHeaders(token),
      data: formData,
      withCredentials: true,
    })
    if (response.status === 200) {
      return {
        character: response.data.character,
        characters: response.data.characters,
      }
    } else {
      throw new Error('Failed to create character')
    }
  } catch (error) {
    console.error('Error creating character', error)
    throw error
  }
}

const deleteCharacter = async (token: string, id: number) => {
  try {
    const response = await axios<CharacterResponse>({
      method: 'delete',
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/characters/${id}`,
      headers: defaultHeaders(token),
      withCredentials: true,
    })
    if (response.status === 200) {
      return {
        character: response.data.character,
        characters: response.data.characters,
      }
    } else {
      throw new Error('Failed to delete character')
    }
  } catch (error) {
    console.error('Error deleting character', error)
    throw error
  }
}

const editCharacter = async (
  token: string,
  id: number,
  character: Character,
  avatar?: File,
) => {
  const formData = new FormData()
  formData.append('character[name]', character.name)
  formData.append('character[mbti_type]', character.mbti_type)
  formData.append('character[tone]', character.tone)
  formData.append('character[first_person]', character.first_person)
  formData.append('character[second_person]', character.second_person)
  formData.append('character[expression]', character.expression)
  formData.append('character[values]', character.values)
  formData.append('character[empathy]', character.empathy)
  formData.append('character[character1_welcome]', character.character1_welcome)
  formData.append('character[character2_welcome]', character.character2_welcome)
  if (avatar) {
    formData.append('avatar', avatar)
  }
  try {
    const response = await axios<CharacterResponse>({
      method: 'put',
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/characters/${id}`,
      headers: defaultHeaders(token),
      data: formData,
      withCredentials: true,
    })
    if (response.status === 200) {
      return {
        character: response.data.character,
        characters: response.data.characters,
      }
    } else {
      throw new Error('Failed to edit character')
    }
  } catch (error) {
    console.error('Error editing character', error)
    throw error
  }
}

export { getCharacters, createCharacter, deleteCharacter, editCharacter }
