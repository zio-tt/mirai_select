import axios from "axios";
import { Tag } from "@/app/_types";

const defaultHeaders = (token: string) => {
  return (
    {
      'X-Requested-With': 'XMLHttpRequest',
      'Authorization': `Bearer ${token}`
    }
  )
};

const getTags = async (token: string): Promise<Tag[]> => {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/tags`;
    const response = await axios.get(url, {
      headers: defaultHeaders(token),
      withCredentials: true,
    });
    if (response.status === 200) {
      return response.data.tags;
    } else {
      throw new Error('Failed to fetch tags');
    }
  } catch (error) {
    console.error('Error fetching tags', error);
    throw error;
  }
};

const createTag = async (
  token:      string,
  tags:       string[],
) => {
  try {
    const response = await axios({
      method: 'post',
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/tags`,
      headers: defaultHeaders(token),
      data: { tags },
      withCredentials: true,
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error('Error creating tag', error);
  }
}

const deleteTag = async (
  token: string,
  id: string,
  handleDeleteTag: (data: any) => void
) => {
  try {
    const response = await axios({
      method: 'delete',
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/tags/${id}`,
      headers: defaultHeaders(token),
      withCredentials: true,
    });
    if (response.status === 200) {
      handleDeleteTag(response.data);
    }
  } catch (error) {
    console.error('Error deleting tag', error);
  }
}

const updateTag = async (
  token: string,
  id: string,
  handleUpdateTag: (data: any) => void
) => {
  try {
    const response = await axios({
      method: 'put',
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/tags/${id}`,
      headers: defaultHeaders(token),
      withCredentials: true,
    });
    if (response.status === 200) {
      handleUpdateTag(response.data);
    }
  } catch (error) {
    console.error('Error updating tag', error);
  }
}

export {
  getTags,
  createTag,
  deleteTag,
  updateTag
};