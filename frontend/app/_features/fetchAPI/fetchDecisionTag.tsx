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

const getDecisionTags = async (token: string): Promise<UserCharacter[]> => {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/decision_tags`;
    const response = await axios.get(url, {
      headers: defaultHeaders(token),
      withCredentials: true,
    });
    if (response.status === 200) {
      return response.data.decision_tags;
    } else {
      throw new Error('Failed to fetch decision_tags');
    }
  } catch (error) {
    console.error('Error fetching decision_tags', error);
    throw error;
  }
}

const createDecisionTags = async (
  token:       string,
  decisionId: number,
  tags:    string[],
) => {
  try {
    const response = await axios({
      method: 'post',
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/decision_tags`,
      headers: defaultHeaders(token),
      data: { decisionId, tags },
      withCredentials: true,
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error('Error creating decision_tag', error);
  }
}

const updateDecisionTags = async (
  token:       string,
  decisionId: number,
  tags:    string[],
) => {
  try {
    const response = await axios({
      method: 'put',
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/decision_tags`,
      headers: defaultHeaders(token),
      data: { decisionId, tags },
      withCredentials: true,
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error('Error updating decision_tag', error);
  }
}

const deleteDecisionTags = async (
  token: string,
  id: string,
  handleDeleteDecisionTag: (data: any) => void
) => {
  try {
    const response = await axios({
      method: 'delete',
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/decision_tags/${id}`,
      headers: defaultHeaders(token),
      data: { id },
      withCredentials: true,
    });
    if (response.status === 200) {
      handleDeleteDecisionTag(response.data);
    }
  } catch (error) {
    console.error('Error deleting decision_tag', error);
  }
}

export {
  getDecisionTags,
  createDecisionTags,
  updateDecisionTags,
  deleteDecisionTags,
};