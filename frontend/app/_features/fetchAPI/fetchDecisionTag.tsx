import axios from 'axios'

import { DecisionTag } from '@/app/_types'

const defaultHeaders = (token: string) => {
  return {
    'X-Requested-With': 'XMLHttpRequest',
    Authorization: `Bearer ${token}`,
  }
}

interface DecisionTagsResponse {
  decision_tags: DecisionTag[]
}

const getDecisionTags = async (token: string): Promise<DecisionTag[]> => {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/decision_tags`
    const response = await axios.get<DecisionTagsResponse>(url, {
      headers: defaultHeaders(token),
      withCredentials: true,
    })
    if (response.status === 200) {
      return response.data.decision_tags
    } else {
      throw new Error('Failed to fetch decision_tags')
    }
  } catch (error) {
    console.error('Error fetching decision_tags', error)
    throw error
  }
}

const createDecisionTags = async (token: string, decisionId: number, tags: string[]) => {
  try {
    const response = await axios<DecisionTagsResponse>({
      method: 'post',
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/decision_tags`,
      headers: defaultHeaders(token),
      data: { decisionId, tags },
      withCredentials: true,
    })
    if (response.status === 200) {
      return response.data.decision_tags
    } else {
      throw new Error('Failed to create decision_tags')
    }
  } catch (error) {
    console.error('Error creating decision_tag', error)
    throw error
  }
}

export { getDecisionTags, createDecisionTags }
