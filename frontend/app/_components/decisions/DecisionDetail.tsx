import { Decision, Conversation, CharacterResponse, Comment, Bookmark } from '@/app/_types';
import { CharacterAvatarWindow } from './Character/CharacterAvatarWindow';
import { CharacterTextWindow } from './Character/CharacterTextWindow';
import { CommentInputForm } from './Comment/CommentInputForm';
import { CommentsDisplay } from './Comment/CommentDisplay';
import { useEffect } from 'react';

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

interface ConversationIndex extends Conversation {
  character_responses: CharacterResponse[];
}

interface DecisionDetailProps {
  users: User[];
  decision: Decision;
  currentUserId: number;
  conversations: ConversationIndex[];
  characters: Character[];
  comments: Comment[] | null;
  onCommentSubmit: (comment: string) => void;
  deleteComment: (commentId: number) => Promise<void>;
  bookmarks: Bookmark[] | null;
  isBookmarked: boolean;
  setIsBookmarked: (isBookmarked: boolean) => void;
  onBookmarkToggle: (decisionId: number | null) => void;
}


const DecisionDetail = ({ 
  users,
  currentUserId,
  conversations,
  decision,
  characters,
  comments,
  onCommentSubmit,
  deleteComment,
  bookmarks,
  isBookmarked,
  setIsBookmarked,
  onBookmarkToggle }: DecisionDetailProps) => {

  const user     = users.find((user) => user.id === currentUserId);

  return (
    <>
      <div className='flex flex-col w-[70%] h-[70vh] items-start justify-start overflow-auto mr-5'>
        {conversations.map((conversation, index) => (
          <div key={index} className='flex flex-col w-full items-center justify-center border p-3 mb-3 '>
            <div className='flex flex-row w-full'>
              <div className='flex flex-col w-full h-full mr-4'>
                <div className='query-text flex w-full h-[15vh] text-center border-gray-200 border-2 rounded items-center justify-center text-lg mb-5'>
                  {conversation.query_text}
                </div>
                {characters.map((character, charIndex) => {
                  // 適切なレスポンスを検索
                  const character_response = conversation.character_responses.find((character_response: CharacterResponse ) => 
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
        <CommentInputForm onSubmit={onCommentSubmit} />
        <CommentsDisplay users={users}
                        currentUserId={currentUserId}
                        comments={comments}
                        deleteComment={deleteComment} />
      </div>
    </>
  );
};

export { DecisionDetail };