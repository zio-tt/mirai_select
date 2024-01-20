import axios from "axios";
import { Bookmark } from "@/app/_types";

const defaultHeaders = (token: string) => {
  return (
    {
      'X-Requested-With': 'XMLHttpRequest',
      'Authorization': `Bearer ${token}`
    }
  )
};

const getBookmarks = async (token: string): Promise<Bookmark[]> => {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/bookmarks`;
    const response = await axios.get(url, {
      headers: defaultHeaders(token),
      withCredentials: true,
    });
    if (response.status === 200) {
      return response.data.bookmarks;
    } else {
      throw new Error('Failed to fetch bookmarks');
    }
  } catch (error) {
    console.error('Error fetching bookmarks', error);
    throw error;
  }
};

const createBookmark = async (
  token: string,
  decisionId: number,
) => {
  try {
    const response = await axios({
      method: 'post',
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/bookmarks`,
      headers: defaultHeaders(token),
      data: { decisionId },
      withCredentials: true,
    });
    if (response.status === 200) {
      return response.data.bookmarks;
    }
  } catch (error) {
    console.error('Error creating bookmark', error);
  }
}

const deleteBookmark = async (
  token: string,
  id: number,
) => {
  try {
    const response = await axios({
      method: 'delete',
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/bookmarks/${id}`,
      headers: defaultHeaders(token),
      data: { id },
      withCredentials: true,
    });
    if (response.status === 200) {
      return response.data.bookmarks;
    }
  } catch (error) {
    console.error('Error deleting bookmark', error);
  }
}

export {
  getBookmarks,
  createBookmark,
  deleteBookmark
}