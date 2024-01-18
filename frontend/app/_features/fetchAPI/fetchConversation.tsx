import axios from "axios";
import { Conversation } from "@/app/_types";

interface CharacterResponse {
  conversation_id: number;
  character_id?:   number;
  response:        string;
}

const defaultHeaders = (token: string) => {
  return (
    {
      'X-Requested-With': 'XMLHttpRequest',
      'Authorization': `Bearer ${token}`
    }
  )
};

const getConversations = async (token: string): Promise<{conversations: Conversation[], character_responses: CharacterResponse[]}> => {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/conversations`;
    const response = await axios(url, {
      headers: defaultHeaders(token),
      withCredentials: true,
    });
    if (response.status === 200) {
      return response.data.conversations;
    } else {
      throw new Error('Failed to fetch conversations');
    }
  } catch (error) {
    console.error('Error fetching conversations', error);
    throw error;
  }
};

const createConversation = async (
  token:              string,
  decisionId:         number,
  queryText:          string,
) => {
  try {
    const response = await axios({
      method: 'post',
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/conversations`,
      headers: defaultHeaders(token),
      data: { decisionId, queryText },
      withCredentials: true,
    });
    if (response.status === 200) {
      return response.data.conversation;
    }
  } catch (error) {
    console.error('Error creating conversation', error);
  }
}

const deleteConversation = async (
  token: string,
  id: string,
  handleDeleteConversation: (data: any) => void
) => {
  try {
    const response = await axios({
      method: 'delete',
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/conversations/${id}`,
      headers: defaultHeaders(token),
      data: { id },
      withCredentials: true,
    });
    if (response.status === 200) {
      handleDeleteConversation(response.data);
    }
  } catch (error) {
    console.error('Error deleting conversation', error);
  }
}

const updateConversation = async (
  token:        string,
  id:           number,
  queryText:    string,
  userDecision: CharacterResponse,
) => {
  try {
    const response = await axios({
      method: 'put',
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/conversations/${id}`,
      headers: defaultHeaders(token),
      data: { queryText, userDecision },
      withCredentials: true,
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error('Error editing conversation', error);
  }
}

export { 
  getConversations,
  createConversation,
  deleteConversation,
  updateConversation
}