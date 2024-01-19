import { Decision, Conversation, Comment, Bookmark } from '@/app/_types';
import { CharacterAvatarWindow } from './Character/CharacterAvatarWindow';
import { CharacterTextWindow } from './Character/CharacterTextWindow';
import { CommentInputForm } from './Comment/CommentInputForm';
import { CommentsDisplay } from './Comment/CommentDisplay';

interface CharacterResponse {
  conversation_id: number;
  character_id?:   number;
  response:        string;
}

interface User {
  id:     number;
  name:   string;
  token:  number;
  avatar: string;
}

interface Character {
  id:         number;
  name:       string;
  avatar:     string;
}

interface DecisionDetailProps {
  users: User[];
  decision: Decision;
  currentUserId: number;
  conversations: Conversation[] | null;
  character_responses: CharacterResponse[];
  characters: Character[] | null;
  comments: Comment[] | null;
  bookmarks: Bookmark[] | null;
  isBookmarked: boolean;
  setIsBookmarked: (isBookmarked: boolean) => void;
  onBookmarkToggle: (decisionId: number | null) => void;
}


const DecisionDetail = ({ 
  users,
  currentUserId,
  conversations,
  character_responses,
  decision,
  characters,
  comments,
  bookmarks,
  isBookmarked,
  setIsBookmarked,
  onBookmarkToggle }: DecisionDetailProps) => {

  const user = users.find((user) => user.id === currentUserId);

  return (
    <>
      <div className='flex flex-col w-[70%] h-[70vh] items-start justify-start overflow-auto mr-5'>
        {conversations && conversations.map((conversation, index) => (
          <div key={index} className='flex flex-col w-full items-center justify-center border p-3 mb-3 '>
            <div className='flex flex-row w-full'>
              <div className='flex flex-col w-full h-full mr-4'>
                <div className='query-text flex w-full h-[15vh] text-center border-gray-200 border-2 rounded items-center justify-center text-lg mb-5'>
                  {conversation.query_text}
                </div>
                {characters && characters.map((character, charIndex) => {
                  // 適切なレスポンスを検索
                  const character_response = character_responses.find((character_response) => 
                    character_response.character_id === character.id
                  );

                  return (
                    <div key={character.id} className='character-response w-full flex items-center justify-center mb-5'>
                      <CharacterAvatarWindow name={character.name} avatar={character.avatar} />
                      {/* character_response が存在する場合のみ response プロパティを渡す */}
                      <CharacterTextWindow response={character_response ? character_response.response : null} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className='flex flex-col w-[30%] overflow-hidden'>
        { decision.user_id != currentUserId && (
            <div className='flex mb-4'>
              <button onClick={() => onBookmarkToggle(decision.id)} className={`p-2 rounded ${isBookmarked ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                {isBookmarked ? 'ブックマーク解除' : 'ブックマーク'} {/* ブックマークの状態に応じてテキストを変更 */}
              </button>
            </div>
          )
        }
        <CommentInputForm />
        <CommentsDisplay />
      </div>
    </>
  );
};

export { DecisionDetail };