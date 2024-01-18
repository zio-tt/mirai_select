import axios from "axios";
import { User, UserCharacter } from "@/app/_types";

const defaultHeaders = (token: string) => {
  return (
    {
      'X-Requested-With': 'XMLHttpRequest',
      'Authorization': `Bearer ${token}`
    }
  )
};

const getUsers = async (
  token:     string,
  condition: string,
): Promise<{users: User[], user_characters: UserCharacter[], current_user: User}> => {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/users`;
    const response = await axios.get(url, {
      headers: defaultHeaders(token),
      params:  { condition },
      withCredentials: true,
    });
    if (response.status === 200) {
      return {
        users: response.data.users,
        user_characters: response.data.user_characters,
        current_user: response.data.current_user,
      };
    } else {
      throw new Error('Failed to fetch users');
    }
  } catch (error) {
    console.error('Error fetching users', error);
    throw error;
  }
};

const createUser = async (
  token: string,
  provider: string | undefined,
  httpsAgent: any,
) => {
  try {
    const response = await axios({
      method: 'post',
      url: `${process.env.NEXT_PUBLIC_WEB_URL}/auth/${provider}/callback/`,
      headers: { 
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' },
      data: { token },
      withCredentials: true,
      httpsAgent,
    });
    if (response.status === 200) {
      return response;
    }
  } catch (error) {
    console.error('Error creating user', error);
  }
}

const deleteUser = async (
  token: string,
  id: string,
  handleDeleteUser: (data: any) => void
) => {
  try {
    const response = await axios({
      method: 'delete',
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`,
      headers: defaultHeaders(token),
      withCredentials: true,
    });
    if (response.status === 200) {
      handleDeleteUser(response.data);
    }
  } catch (error) {
    console.error('Error deleting user', error);
  }
}

const updateUser = async (
  token:           string,
  id:              number,
  remainingTokens: number,
) => {
  try {
    const response = await axios({
      method: 'put',
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`,
      headers: defaultHeaders(token),
      data: { remainingTokens },
      withCredentials: true,
    });
    if (response.status === 200) {
      return response.data.user;
    }
  } catch (error) {
    console.error('Error editing user', error);
  }
}

export {
  getUsers,
  createUser,
  deleteUser,
  updateUser
}