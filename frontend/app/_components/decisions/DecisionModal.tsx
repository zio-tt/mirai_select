import { useDetailData }  from '../../_hooks/_decisions/useDetailData';
import { Decision, User, Conversation, Comment, Bookmark } from '@/app/_types';
import { DecisionDetail } from '@/app/_components/decisions/DecisionDetail';
import { useDecisions } from '@/app/_contexts/DecisionsContext';

const DecisionModal = ({
  decision,
  conversations,
  isBookmarked,
  setIsBookmarked,
  onBookmarkToggle,
  handleCloseDetail,
}: {
  decision:    Decision,
  conversations: Conversation[],
  isBookmarked: boolean,
  setIsBookmarked: (isBookmarked: boolean) => void,
  onBookmarkToggle: (decisionId: number | null) => void,
  handleCloseDetail: () => void,
}) => {

  const { users, comments, bookmarks, currentUser } = useDecisions();
  const { decisionCharacters, characterResponses } = useDetailData(decision);

  return (
    <>
      { decisionCharacters && characterResponses && (
        <div className='fixed inset-0 flex items-center justify-center z-10'>
          <div className='fixed inset-0 bg-black bg-opacity-50' onClick={handleCloseDetail}></div>
          <div className="flex w-[80vw] ml-[20vw] h-[100vh] items-center justify-center">
            <div className="flex flex-col w-[80%] h-[80%] bg-white p-5 rounded-lg items-center z-20">
              <div className='flex justify-center items-start'>
                <DecisionDetail
                  users={users!}
                  decision={decision}
                  currentUserId={currentUser!.id}
                  conversations={conversations!}
                  character_responses={characterResponses!}
                  characters={decisionCharacters ? decisionCharacters : null}
                  comments={comments && comments.length > 0 ? comments.filter(comment => comment.decision_id === decision.id) : null}
                  bookmarks={bookmarks && bookmarks.length > 0 ? bookmarks.filter(bookmark => bookmark.decision_id === decision.id) : null}
                  isBookmarked={isBookmarked}
                  setIsBookmarked={setIsBookmarked}
                  onBookmarkToggle={onBookmarkToggle}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export { DecisionModal }