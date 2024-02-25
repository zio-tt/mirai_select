import axios from 'axios'

import { Decision } from '@/app/_types'

const defaultHeaders = (token: string) => {
  return {
    'X-Requested-With': 'XMLHttpRequest',
    Authorization: `Bearer ${token}`,
  }
}

interface getDecisionProps {
  token: string
  condition: string
}

interface deleteDecisionProps {
  token: string
  decisionId: number
  condition: string
}

interface DecisionsResponse {
  decisions: Decision[]
}

interface DecisionResponse {
  decision: Decision
}

const getDecisions = async ({
  token,
  condition,
}: getDecisionProps): Promise<Decision[]> => {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/decisions`
    const response = await axios.get<DecisionsResponse>(url, {
      headers: defaultHeaders(token),
      params: { condition },
      withCredentials: true,
    })
    if (response.status === 200) {
      return response.data.decisions
    } else {
      throw new Error('Failed to fetch decisions')
    }
  } catch (error) {
    console.error('Error fetching decisions', error)
    throw error
  }
}

interface CreateDecisionResponse {
  decision: Decision
}

const createDecision = async (token: string) => {
  try {
    const response = await axios<CreateDecisionResponse>({
      method: 'post',
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/decisions`,
      headers: defaultHeaders(token),
      withCredentials: true,
    })
    if (response.status === 200) {
      return response.data.decision
    } else {
      throw new Error('Failed to create decision')
    }
  } catch (error) {
    console.error('Error creating decision', error)
    throw error
  }
}

const deleteDecision = async ({ token, decisionId, condition }: deleteDecisionProps) => {
  try {
    const response = await axios<DecisionsResponse>({
      method: 'delete',
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/decisions/${decisionId}`,
      headers: defaultHeaders(token),
      params: { condition },
      withCredentials: true,
    })
    if (response.status === 200) {
      return response.data.decisions
    } else {
      throw new Error('Failed to delete decision')
    }
  } catch (error) {
    console.error('Error deleting decision', error)
    throw error
  }
}

const updateDecision = async (token: string, decisionId: number, isPublic: boolean) => {
  try {
    const response = await axios<DecisionResponse>({
      method: 'put',
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/decisions/${decisionId}`,
      headers: defaultHeaders(token),
      data: { isPublic },
      withCredentials: true,
    })
    if (response.status === 200) {
      return response.data.decision
    } else {
      throw new Error('Failed to edit decision')
    }
  } catch (error) {
    console.error('Error editing decision', error)
    throw error
  }
}

export { getDecisions, createDecision, deleteDecision, updateDecision }
