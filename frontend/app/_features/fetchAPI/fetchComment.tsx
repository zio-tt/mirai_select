import axios from "axios";
import { Comment } from "@/app/_types";

const defaultHeaders = (token: string) => {
  return (
    {
      'X-Requested-With': 'XMLHttpRequest',
      'Authorization': `Bearer ${token}`
    }
  )
};

const getComments = async (token: string): Promise<Comment[]> => {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/comments`;
    const response = await axios(url, {
      headers: defaultHeaders(token),
      withCredentials: true,
    });
    if (response.status === 200) {
      return response.data.comments;
    } else {
      throw new Error('Failed to fetch comments');
    }
  } catch (error) {
    console.error('Error fetching comments', error);
    throw error;
  }
};

const createComment = async (
  token: string,
  content: string,
  decisionId: number,
) => {
  try {
    const response = await axios({
      method: 'post',
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/comments`,
      headers: defaultHeaders(token),
      data: { content, decisionId },
      withCredentials: true,
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error('Error creating comment', error);
  }
}

const deleteComment = async (
  token: string,
  id: number,
) => {
  try {
    const response = await axios({
      method: 'delete',
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/comments/${id}`,
      headers: defaultHeaders(token),
      withCredentials: true,
    });
    if (response.status === 200) {
      return response.data.comments;
    }
  } catch (error) {
    console.error('Error deleting comment', error);
  }
}

const editComment = async (
  token: string,
  id: string,
  content: string,
  handleEditComment: (data: any) => void
) => {
  try {
    const response = await axios({
      method: 'put',
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/comments/${id}`,
      headers: defaultHeaders(token),
      data: { content },
      withCredentials: true,
    });
    if (response.status === 200) {
      handleEditComment(response.data);
    }
  } catch (error) {
    console.error('Error editing comment', error);
  }
}

export { getComments, createComment, deleteComment, editComment }