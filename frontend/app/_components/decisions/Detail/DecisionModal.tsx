import { useDetailData }  from '../../../_hooks/_decisions/useDetailData';
import { Decision, User, Conversation, Comment, Bookmark } from '@/app/_types';
import { DecisionDetail } from '@/app/_components/decisions/Detail/DecisionDetail';
import { useDecisions } from '@/app/_contexts/DecisionsContext';
import { CommentInputForm } from '@/app/_components/decisions/Comment/CommentInputForm';
import { CommentsDisplay } from '@/app/_components/decisions/Comment/CommentDisplay';
import { CommentButton } from '../Comment/CommentButton';

const DecisionModal = ({
  decision,
  conversations,
  handleCloseDetail,
}: {
  decision:    Decision,
  conversations: Conversation[],
  handleCloseDetail: () => void,
}) => {

  const { users, currentUser } = useDecisions();
  const { decisionCharacters, characterResponses } = useDetailData(decision);

  return (
    <>
      { decisionCharacters && characterResponses && (
        <div className='fixed inset-0 flex items-center justify-center z-10'>
          <div className='fixed inset-0 bg-black bg-opacity-50' onClick={handleCloseDetail} data-theme="fantasy">
          </div>
            <div className="flex w-[80vw] ml-[20vw] h-[100vh] items-center justify-center">
              <div className="flex flex-col w-[60%] h-[90%] bg-white p-5 rounded-lg items-center mr-2 z-20">
                <div className='flex justify-center items-start'>
                  <DecisionDetail
                    users={users!}
                    currentUserId={currentUser!.id}
                    conversations={conversations!}
                    decisionCharacters={decisionCharacters}
                    characterResponses={characterResponses}
                    decision={decision}
                  />
                </div>
              </div>
              <div className="flex flex-col w-[30%] h-[90%] bg-white py-5 rounded-lg items-center ml-4 z-20">
                <div className="flex flex-col w-full h-full justify-between" data-theme="fantasy">
                  <CommentsDisplay />
                  <CommentButton />
                  <CommentInputForm />
                </div>
              </div>
            </div>
        </div>
      )}
    </>
  );
}

export { DecisionModal }