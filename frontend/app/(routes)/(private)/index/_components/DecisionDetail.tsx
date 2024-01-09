import { Decision, Conversation, Character, CharacterResponse } from '@/app/_types';

interface DecisionDetailProps {
  decision: Decision;
  conversations: Conversation[];
  characters: Character[];
  character_responses: CharacterResponse[];
}

const DecisionDetail = ({ decision, conversations, characters, character_responses }: DecisionDetailProps) => {
  return (
    <>
      {conversations && conversations.map((conversation, index) => {
        characters.map((character, index) => {
          return (
            <div key={character.id} className='character-response flex h-[30%] w-[90%] text-black p-4 items-center rounded-md'>
              <div className='flex flex-col h-full w-full items-center'>
                <div className='flex'>{conversation.query_text}</div>
                <div className='flex flex-row h-full w-full items-center'>
                  <div className='flex flex-col h-full w-full items-center'>
                    <div className='flex'>{character.avatar}</div>
                    <div className='flex'>{character.name}</div>
                  </div>
                  <div className='flex'>{character_responses[index].response}</div>
                </div>
              </div>
            </div>
          );
        });
      })}
    </>
  );
};

export { DecisionDetail };