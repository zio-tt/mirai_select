import { CharacterResponseDisplay } from '@/app/_components/decisions/Detail/CharacterResponseDisplay'
import { UserQueryDisplay } from '@/app/_components/decisions/Detail/UserQueryDisplay'
import { Conversation, Character, User } from '@/app/_types'

interface CharacterResponse {
  id: number
  conversation_id: number
  character_id?: number
  response: string
}

interface DecisionDetailProps {
  conversations: Conversation[]
  decisionUser: User
  decisionCharacters: Character[]
  characterResponses: CharacterResponse[]
}

const GuestDecisionDetail = ({
  conversations,
  decisionUser,
  decisionCharacters,
  characterResponses,
}: DecisionDetailProps) => {
  return (
    <>
      <div
        className='flex flex-col w-[90%] h-[90%] items-center justify-start overflow-auto'
        data-theme='pastel'
      >
        {conversations &&
          conversations.map((conversation, index) => {
            return (
              <div
                key={index}
                className='flex flex-col w-full items-start justify-start border px-6 pt-5 mb-3 '
              >
                <div className='flex flex-col w-full h-full mr-4'>
                  <UserQueryDisplay
                    decisionUser={decisionUser}
                    queryText={conversation.query_text}
                  />
                  {decisionCharacters.map((character) => {
                    const characterResponse = characterResponses.find(
                      (character_response) =>
                        character_response.character_id === character.id,
                    )

                    if (!characterResponse) {
                      return null
                    }

                    return (
                      <div
                        key={character.id}
                        className='character-response w-full flex items-start justify-start mb-5'
                      >
                        <CharacterResponseDisplay
                          decisionCharacter={character}
                          characterResponse={characterResponse}
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

export { GuestDecisionDetail }
