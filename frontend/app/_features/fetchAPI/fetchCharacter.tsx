import axios from "axios";
import { Character } from "@/app/_types";

const defaultHeaders = (token: string) => {
  return (
    {
      'X-Requested-With': 'XMLHttpRequest',
      'Authorization': `Bearer ${token}`
    }
  )
};

const getCharacters = async (
  token: string,
  condition: string,
  decisionId?: number,
): Promise<Character[]> => {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/characters`;
    const response = await axios(url, {
      headers: defaultHeaders(token),
      params: { condition, decisionId },
      withCredentials: true,
    });
    if (response.status === 200) {
      return response.data.characters;
    } else {
      throw new Error('Failed to fetch characters');
    }
  } catch (error) {
    console.error('Error fetching characters', error);
    throw error;
  }
};

const createCharacter = async (
  token: string,
  handleCreateCharacter: (data: any) => void
) => {
  try {
    const response = await axios({
      method: 'post',
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/characters`,
      headers: defaultHeaders(token),
      withCredentials: true,
    });
    if (response.status === 200) {
      handleCreateCharacter(response.data);
    }
  } catch (error) {
    console.error('Error creating character', error);
  }
}

const deleteCharacter = async (
  token: string,
  id: string,
  handleDeleteCharacter: (data: any) => void
) => {
  try {
    const response = await axios({
      method: 'delete',
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/characters/${id}`,
      headers: defaultHeaders(token),
      withCredentials: true,
    });
    if (response.status === 200) {
      handleDeleteCharacter(response.data);
    }
  } catch (error) {
    console.error('Error deleting character', error);
  }
}

const editCharacter = async (
  token: string,
  id: string,
  handleEditCharacter: (data: any) => void
) => {
  try {
    const response = await axios({
      method: 'put',
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/characters/${id}`,
      headers: defaultHeaders(token),
      withCredentials: true,
    });
    if (response.status === 200) {
      handleEditCharacter(response.data);
    }
  } catch (error) {
    console.error('Error editing character', error);
  }
}

export {
  getCharacters,
  createCharacter,
  deleteCharacter,
  editCharacter
}