import { useState, useEffect } from 'react'

import { useDecisions } from '@/app/_contexts/_featureContexts/DecisionsContext'
import { Decision, Conversation, Character, DecisionCharacter } from '@/app/_types'

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
  decisionCharacterList: DecisionCharacter[]
  characterResponses: CharacterResponse[] | null
}

const DecisionDetail = ({
  decision,
  conversations,
  decisionCharacters,
  decisionCharacterList,
  characterResponses,
}: DecisionDetailProps) => {
  const { users } = useDecisions()
  const [sortedDecisionCharacters, setSortedDecisionCharacters] = useState<
    Character[] | null
  >(null)

  useEffect(() => {
    // decisionCharactersとdecisionCharacterListが存在し、
    // かつdecisionCharactersのidがすべてdecisionCharacterListのcharacter_listに存在し、
    // decisionCharacterListのroleが全て存在する場合
    // decisionCharacterListのroleの順番に並び替えてsetSortedDecisionCharactersにセットする
    const sortedDecisionCharacterList = decisionCharacterList.sort(
      (a, b) => a.role - b.role,
    )
    if (decisionCharacters && sortedDecisionCharacterList) {
      const sortedCharacters = sortedDecisionCharacterList
        .map((decisionCharacter) => {
          const character = decisionCharacters.find(
            (character) => character.id === decisionCharacter.character_id,
          )
          return character
        })
        .filter((character) => character)
      setSortedDecisionCharacters(sortedCharacters as Character[])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decisionCharacters])

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
                  {sortedDecisionCharacters &&
                    sortedDecisionCharacters.map((character) => {
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
