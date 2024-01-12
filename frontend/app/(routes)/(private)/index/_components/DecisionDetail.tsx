import { Conversation, CharacterResponse, Comment } from '@/app/_types';
import { CharacterAvatarWindow } from './Character/CharacterAvatarWindow';
import { CharacterTextWindow } from './Character/CharacterTextWindow';
import { CommentInputForm } from './Comment/CommentInputForm';
import { CommentsDisplay } from './Comment/CommentDisplay';
import { BookmarkButton } from './Bookmark/BookmarkButton';

interface Character {
  id:         number;
  name:       string;
  avatar:     string;
}

interface ConversationIndex extends Conversation {
  character_responses: CharacterResponse[];
}

interface DecisionDetailProps {
  conversations: ConversationIndex[];
  characters: Character[];
  comments: Comment[];
  onCommentSubmit: (comment: string) => void;
  isBookmarked: boolean;
  onBookmarkToggle: () => void;
}

const DecisionDetail = ({ conversations, characters, comments, onCommentSubmit, isBookmarked, onBookmarkToggle }: DecisionDetailProps) => {
  return (
    <>
      {conversations.map((conversation, index) => (
        <div key={index} className='flex flex-col w-full h-full items-center justify-center'>
          <div className='flex flex-row w-full h-[70vh]'>
            <div className='flex flex-col w-[70%] h-full mr-4'>
              <div className='query-text flex w-full h-[20vh] text-center border-gray-200 border-2 rounded items-center justify-center text-lg mb-5'>
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
            <div className='flex flex-col'>
              <CommentInputForm onSubmit={onCommentSubmit} />
              <CommentsDisplay comments={comments} />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export { DecisionDetail };