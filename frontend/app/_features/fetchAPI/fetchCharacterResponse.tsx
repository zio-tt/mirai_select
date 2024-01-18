import axios from "axios";
import { UserCharacter } from "@/app/_types";

const defaultHeaders = (token: string) => {
  return (
    {
      'X-Requested-With': 'XMLHttpRequest',
      'Authorization': `Bearer ${token}`
    }
  )
};

const getCharacterResponses = async (token:string): Promise<UserCharacter[]> => {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/character_responses`;
    const response = await axios.get(url, {
      headers: defaultHeaders(token),
      withCredentials: true,
    });
    if (response.status === 200) {
      return response.data.character_responses;
    } else {
      throw new Error('Failed to fetch character_responses');
    }
  } catch (error) {
    console.error('Error fetching character_responses', error);
    throw error;
  }
};

const createCharacterResponses = async (
  token:       string,
  characterId: number,
  characterResponse:    string,
) => {
  try {
    const response = await axios({
      method: 'post',
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/character_responses`,
      headers: defaultHeaders(token),
      data: { characterId, characterResponse },
      withCredentials: true,
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error('Error creating character_response', error);
  }
};

export {
  getCharacterResponses,
  createCharacterResponses,
};