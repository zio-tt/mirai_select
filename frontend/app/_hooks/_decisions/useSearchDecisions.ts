import { Decision, Tag, DecisionTag, Conversation } from '@/app/_types'

const useSearchDecisions = (
  decisions: Decision[],
  conversations: Conversation[],
  tags: Tag[],
  decisionTags: DecisionTag[],
  searchQuery: string,
  selectedTag: string,
  sortOrder: string,
  filteredDecisions: Decision[],
) => {
  if (!decisions) return
  let filtered: Decision[] = []

  if (filteredDecisions.length === 0 && decisions.length > 0) {
    filtered = [...decisions]
  } else if (filteredDecisions.length > 0) {
    filtered = [...filteredDecisions]
  } else {
    return
  }

  if (selectedTag) {
    filtered = filtered.filter((decision) => {
      const filteredDecisionTags = decisionTags.filter(
        (decisionTag) => decisionTag.decision_id === decision.id,
      )
      return filteredDecisionTags.some((decision_tag) => {
        const tag = tags.find((tag) => tag.id === decision_tag.tag_id)
        return tag && tag.name === selectedTag
      })
    })
  }

  if (searchQuery) {
    filtered = filtered.filter((decision) => {
      const filteredConversations = conversations.filter(
        (conversation) => conversation.decision_id === decision.id,
      )
      return filteredConversations.some((conversation) =>
        conversation.query_text.includes(searchQuery),
      )
    })
  }

  // ソート処理
  if (sortOrder === 'date_new') {
    filtered.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
  } else if (sortOrder === 'date_old') {
    filtered.sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    )
  }

  return filtered
}

export { useSearchDecisions }
