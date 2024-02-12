import { useDecisions } from '@/app/_contexts/DecisionsContext'
import { Decision, Conversation, Character } from '@/app/_types'

import { CharacterResponseDisplay } from './CharacterResponseDisplay'
import { UserQueryDisplay } from './UserQueryDisplay'

interface CharacterResponse {
  id: number
  conversation_id: number
  character_id?: number
  response: string
}

interface DecisionDetailProps {
  decision: Decision
  conversations: Conversation[] | null
  decisionCharacters: Character[] | null
  characterResponses: CharacterResponse[] | null
}

const DecisionDetail = ({
  decision,
  conversations,
  decisionCharacters,
  characterResponses,
}: DecisionDetailProps) => {
  const { users } = useDecisions()

  return (
    <>
      <div
        className='flex flex-col w-[90%] h-[90%] items-center justify-start overflow-auto'
        data-theme='pastel'
      >
        {conversations &&
          conversations.map((conversation, index) => {
            // conversationに対するcharacterResponsesを取得
            const conversationCharacterResponses = characterResponses
              ? characterResponses.filter(
                  (character_response) =>
                    character_response.conversation_id === conversation.id,
                )
              : null
            return (
              <div
                key={index}
                className='flex flex-col w-full items-start justify-start border px-6 pt-5 mb-3 '
              >
                <div className='flex flex-col w-full h-full mr-4'>
                  <UserQueryDisplay
                    decisionUser={users.find((user) => user.id === decision.user_id)!}
                    queryText={conversation.query_text}
                  />
                  {decisionCharacters &&
                    decisionCharacters.map((character) => {
                      const characterResponse = conversationCharacterResponses
                        ? conversationCharacterResponses.find(
                            (character_response) =>
                              character_response.character_id === character.id,
                          )
                        : null

                      return (
                        <div
                          key={character.id}
                          className='character-response w-full flex items-start justify-start mb-5'
                        >
                          <CharacterResponseDisplay
                            decisionCharacter={character}
                            characterResponse={characterResponse!}
                            userDecision={conversation.user_decision}
                          />
                        </div>
                      )
                    })}
                </div>
              </div>
            )
          })}
      </div>
    </>
  )
}

export { DecisionDetail }
