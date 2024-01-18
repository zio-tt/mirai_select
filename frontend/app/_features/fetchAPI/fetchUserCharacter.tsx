import axios from "axios";
import { Character, UserCharacter } from "@/app/_types";

const defaultHeaders = (token: string) => {
  return (
    {
      'X-Requested-With': 'XMLHttpRequest',
      'Authorization': `Bearer ${token}`
    }
  )
};

interface UserCharacterProps {
  user_characters: UserCharacter[];
  charactersData:  Character[];
};

const getUserCharacters = async (
  token:     string,
  condition: string,
): Promise<UserCharacterProps> => {
  try{
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/user_characters`;
    const response = await axios.get(url, {
      headers: defaultHeaders(token),
      params: { condition },
      withCredentials: true,
    });
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to fetch user_characters');
    }
  } catch (error) {
    console.error('Error fetching user_characters', error);
    throw error;
  }
};

const updateUserCharacter = async (
  token: string,
  id:    number,
  role:  number,
  oldCharacterId: number,
  newCharacterId: number,
) => {
  try {
    const response = await axios({
      method: 'put',
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/user_characters/${id}`,
      headers: defaultHeaders(token),
      data: { role, oldCharacterId, newCharacterId },
      withCredentials: true,
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error('Error updating user_character', error);
  }
}

export {
  getUserCharacters,
  updateUserCharacter,
}