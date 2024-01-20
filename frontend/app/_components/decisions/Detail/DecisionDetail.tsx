import { Decision, Conversation, User, Character } from '@/app/_types';
import { CommentInputForm } from '../Comment/CommentInputForm';
import { CommentsDisplay } from '../Comment/CommentDisplay';
import { CharacterResponseDisplay } from './CharacterResponseDisplay';
import { useDetailData } from '@/app/_hooks/_decisions/useDetailData';
import { UserQueryDisplay } from './UserQueryDisplay';
import { useDecisions } from '@/app/_contexts/DecisionsContext';

interface CharacterResponse {
  conversation_id: number;
  character_id?:   number;
  response:        string;
}

interface DecisionDetailProps {
  users: User[];
  currentUserId: number;
  conversations: Conversation[] | null;
  decisionCharacters: Character[] | null;
  characterResponses: CharacterResponse[] | null;
  decision: Decision;
}


const DecisionDetail = ({ 
  users,
  currentUserId,
  conversations,
  decisionCharacters,
  characterResponses,
  decision, }: DecisionDetailProps) => {

  const { selectedDecision } = useDecisions();

  return (
    <>
      <div className='flex flex-col w-[90%] h-[70vh] items-start justify-start overflow-auto mr-5' data-theme="fantasy">
        {conversations && conversations.map((conversation, index) => {
          // conversationに対するcharacterResponsesを取得
          const conversationCharacterResponses = characterResponses ? characterResponses.filter((character_response) => character_response.conversation_id === conversation.id) : null;
          return (
            <div key={index} className='flex flex-col w-full items-start justify-start border px-6 pt-5 mb-3 '>
              <div className='flex flex-col w-full h-full mr-4'>
                <UserQueryDisplay decisionUser={users.find((user) => user.id === selectedDecision!.user_id)!}
                                  queryText={conversation.query_text} />
                {decisionCharacters && decisionCharacters.map((character, charIndex) => {
                  const characterResponse = conversationCharacterResponses ? conversationCharacterResponses.find((character_response) => 
                    character_response.character_id === character.id
                  ) : null;

                  return (
                    <div key={character.id} className='character-response w-full flex items-start justify-start mb-5'>
                      <CharacterResponseDisplay decisionCharacter={character} characterResponse={characterResponse!} />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export { DecisionDetail };