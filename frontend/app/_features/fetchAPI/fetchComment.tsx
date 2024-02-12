import axios from 'axios'

import { Comment } from '@/app/_types'

const defaultHeaders = (token: string) => {
  return {
    'X-Requested-With': 'XMLHttpRequest',
    Authorization: `Bearer ${token}`,
  }
}

interface CommentsResponse {
  comments: Comment[]
}

const getComments = async (token: string): Promise<Comment[]> => {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/comments`
    const response = await axios<CommentsResponse>(url, {
      headers: defaultHeaders(token),
      withCredentials: true,
    })
    if (response.status === 200) {
      return response.data.comments
    } else {
      throw new Error('Failed to fetch comments')
    }
  } catch (error) {
    console.error('Error fetching comments', error)
    throw error
  }
}

const createComment = async (token: string, content: string, decisionId: number) => {
  try {
    const response = await axios<CommentsResponse>({
      method: 'post',
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/comments`,
      headers: defaultHeaders(token),
      data: { content, decisionId },
      withCredentials: true,
    })
    if (response.status === 200) {
      return response.data.comments
    } else {
      throw new Error('Failed to create comment')
    }
  } catch (error) {
    console.error('Error creating comment', error)
    throw error
  }
}

const deleteComment = async (token: string, id: number) => {
  try {
    const response = await axios<CommentsResponse>({
      method: 'delete',
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/comments/${id}`,
      headers: defaultHeaders(token),
      withCredentials: true,
    })
    if (response.status === 200) {
      return response.data.comments
    } else {
      throw new Error('Failed to delete comment')
    }
  } catch (error) {
    console.error('Error deleting comment', error)
    throw error
  }
}

export { getComments, createComment, deleteComment }
