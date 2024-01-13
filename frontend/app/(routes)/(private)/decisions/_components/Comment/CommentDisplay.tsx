import { Comment } from "@/app/_types";

interface CommentDisplayProps {
  comments: Comment[];
}

const CommentsDisplay = ({ comments } : CommentDisplayProps) => (
  <div className="flex flex-col flex-grow w-full border">
    {comments.map((comment, index) => (
      <div key={index} className="border-b p-2">
        {comment.content}
      </div>
    ))}
  </div>
);

export { CommentsDisplay };