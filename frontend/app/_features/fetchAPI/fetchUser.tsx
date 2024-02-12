import axios from 'axios'

import { User, UserCharacter } from '@/app/_types'

const defaultHeaders = (token: string) => {
  return {
    'X-Requested-With': 'XMLHttpRequest',
    Authorization: `Bearer ${token}`,
  }
}

interface UserResponse {
  users: User[]
  user_characters: UserCharacter[]
  current_user: User
}

const getUsers = async (
  token: string,
  condition: string,
): Promise<{ users: User[]; user_characters: UserCharacter[]; current_user: User }> => {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/users`
    const response = await axios.get<UserResponse>(url, {
      headers: defaultHeaders(token),
      params: { condition },
      withCredentials: true,
    })
    if (response.status === 200) {
      return {
        users: response.data.users,
        user_characters: response.data.user_characters,
        current_user: response.data.current_user,
      }
    } else {
      throw new Error('Failed to fetch users')
    }
  } catch (error) {
    console.error('Error fetching users', error)
    throw error
  }
}

const updateUser = async (token: string, id: number, remainingTokens: number) => {
  try {
    const response = await axios<UserResponse>({
      method: 'put',
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`,
      headers: defaultHeaders(token),
      data: { remainingTokens },
      withCredentials: true,
    })
    if (response.status === 200) {
      return response.data.current_user
    }
  } catch (error) {
    console.error('Error editing user', error)
  }
}

export { getUsers, updateUser }
