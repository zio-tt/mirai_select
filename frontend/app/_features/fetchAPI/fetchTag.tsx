import axios from 'axios'

import { Tag } from '@/app/_types'

const defaultHeaders = (token: string) => {
  return {
    'X-Requested-With': 'XMLHttpRequest',
    Authorization: `Bearer ${token}`,
  }
}

interface TagsResponse {
  tags: Tag[]
}

const getTags = async (token: string): Promise<Tag[]> => {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/tags`
    const response = await axios.get<TagsResponse>(url, {
      headers: defaultHeaders(token),
      withCredentials: true,
    })
    if (response.status === 200) {
      return response.data.tags
    } else {
      throw new Error('Failed to fetch tags')
    }
  } catch (error) {
    console.error('Error fetching tags', error)
    throw error
  }
}

const createTag = async (token: string, tags: string[]) => {
  try {
    const response = await axios<TagsResponse>({
      method: 'post',
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/tags`,
      headers: defaultHeaders(token),
      data: { tags },
      withCredentials: true,
    })
    if (response.status === 200) {
      return response.data.tags
    } else {
      throw new Error('Failed to create tags')
    }
  } catch (error) {
    console.error('Error creating tag', error)
    throw error
  }
}

export { getTags, createTag }
