import Image from "next/image";
import { useDecisions } from "@/app/_contexts/DecisionsContext";
import { useDecisionsData } from "@/app/_hooks/_decisions/useDecisionsData";
import { deleteComment } from "@/app/_features/fetchAPI/fetchComment";

const CommentsDisplay = () => {
  // initial state
  const { setComments } = useDecisions();
  const { currentUser, users, comments, selectedDecision} = useDecisions();
  const { token } = useDecisionsData();
  if (!currentUser || !users || !comments) return null;

  const decisionComments = comments.filter((comment) => comment.decision_id === selectedDecision!.id);

  const deleteCommentsData = async (id: number) => {
    if (token) {
      const data = await deleteComment(token, id);
      setComments(data);
    }
  }

  const handleDeleteComment = (id: number) => {
    if (!id) return;
    deleteCommentsData(id);
  };

  return (
    <div className="flex flex-col flex-grow w-full border overflow-auto h-[60%]">
      {decisionComments.map((comment, index) => {
        const user = users?.find((user) => user.id === comment.user_id);
        return (
          <div key={index} className="flex flex-row border-b p-2 items-center">
            <Image alt={user!.name}
                  src={user!.avatar || '/images/logo.png'}
                  width={30} height={30}
                  className="flex rounded-full" />
            <div className="overflow-y-auto">
              <div className="p-4  border-gray-200">
                <span>{comment.content}</span>
              </div>
            </div>
            { currentUser.id === comment.user_id && (
              <Image alt="削除"
                    src="/images/delete_button.png"
                    width={20} height={20}
                    onClick={() => handleDeleteComment(comment.id)}
                    className="flex ml-2 opacity-20" />
            )}
          </div>
        )}
      )}
    </div>
  )
};

export { CommentsDisplay };