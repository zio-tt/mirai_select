import { Comment } from "@/app/_types";
import Image from "next/image";

interface User {
  id:     number;
  name:   string;
  token:  number;
  avatar: string;
}

interface CommentDisplayProps {
  users: User[];
  currentUserId: number;
  comments: Comment[] | null;
  deleteComment: (commentId: number) => Promise<void>;
}

const CommentsDisplay = ({ users, currentUserId, comments, deleteComment }: CommentDisplayProps) => (
  <div className="flex flex-col flex-grow w-full border overflow-auto h-[50vh]">
    {comments!.map((comment, index) => {
      const user = users?.find((user) => user.id === comment.user_id);
      return (
        <div key={index} className="flex flex-row border-b p-2 items-center">
          <Image alt={user!.name} 
                 src={user!.avatar || '/images/logo.png'}
                 width={50} height={50}
                 className="flex" />
          <div className="flex grow">{comment.content}</div>
          { currentUserId === comment.user_id && (
            <Image alt="削除" 
                   src="/images/delete_button.png"
                   width={20} height={20}
                   onClick={() => deleteComment(comment.id)}
                   className="flex ml-2 opacity-20" />
          )}
        </div>
      )}
    )}
  </div>
);

export { CommentsDisplay };