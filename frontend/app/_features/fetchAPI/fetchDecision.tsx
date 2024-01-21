import axios from "axios";
import { Decision, DecisionTag } from "@/app/_types";

const defaultHeaders = (token: string) => {
  return (
    {
      'X-Requested-With': 'XMLHttpRequest',
      'Authorization': `Bearer ${token}`
    }
  )
};

interface getDecisionProps {
  token:     string;
  condition: string;
}

interface deleteDecisionProps {
  token:      string;
  decisionId: number;
}

const getDecisions = async ({token, condition}: getDecisionProps): Promise<Decision[]> => {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/decisions`;
    const response = await axios.get(url, {
      headers: defaultHeaders(token),
      params: { condition },
      withCredentials: true,
    });
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to fetch decisions');
    }
  } catch (error) {
    console.error('Error fetching decisions', error);
    throw error;
  }
};

const createDecision = async (token: string) => {
  try {
    const response = await axios({
      method: 'post',
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/decisions`,
      headers: defaultHeaders(token),
      withCredentials: true,
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error('Error creating decision', error);
  }
}

const deleteDecision = async ({
  token,
  decisionId
}: deleteDecisionProps) => {
  try {
    const response = await axios({
      method: 'delete',
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/decisions/${decisionId}`,
      headers: defaultHeaders(token),
      withCredentials: true,
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error('Error deleting decision', error);
  }
}

const updateDecision = async (
  token: string,
  decisionId: number,
  isPublic: boolean,
) => {
  try {
    const response = await axios({
      method: 'put',
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/decisions/${decisionId}`,
      headers: defaultHeaders(token),
      data: { isPublic },
      withCredentials: true,
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error('Error editing decision', error);
  }
}

export {
  getDecisions,
  createDecision,
  deleteDecision,
  updateDecision }