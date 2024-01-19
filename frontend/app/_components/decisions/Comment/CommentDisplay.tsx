import Image from "next/image";
import { useDecisions } from "@/app/_contexts/DecisionsContext";

const CommentsDisplay = () => {
  // initial state
  const { currentUser, users, comments, selectedDecision} = useDecisions();
  if (!currentUser || !users || !comments) return null;

  const decisionComments = comments.filter((comment) => comment.decision_id === selectedDecision!.id);

  return (
    <div className="flex flex-col flex-grow w-full border overflow-auto h-[50vh]">
      {decisionComments.map((comment, index) => {
        const user = users?.find((user) => user.id === comment.user_id);
        return (
          <div key={index} className="flex flex-row border-b p-2 items-center">
            <Image alt={user!.name}
                   src={user!.avatar || '/images/logo.png'}
                   width={50} height={50}
                   className="flex" />
            <div className="flex grow">{comment.content}</div>
            { currentUser.id === comment.user_id && (
              <Image alt="削除"
                     src="/images/delete_button.png"
                     width={20} height={20}
                     className="flex ml-2 opacity-20" />
            )}
          </div>
        )}
      )}
    </div>
  )
};

export { CommentsDisplay };