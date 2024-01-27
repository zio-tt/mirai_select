import Image from "next/image";
import { useState } from "react";
import { useDecisions } from "@/app/_contexts/DecisionsContext";
import { createComment } from "@/app/_features/fetchAPI/fetchComment";
import { useDecisionsData } from "@/app/_hooks/_decisions/useDecisionsData";
import { Decision } from "@/app/_types";

interface CommentsInputFormProps {
  decision: Decision;
}

const CommentInputForm = ({
  decision,
}: CommentsInputFormProps) => {
  const [comment,  setComment]  = useState<string>('');
  const {comments, setComments} = useDecisions();
  const {token}                 = useDecisionsData();

  const createCommentsData = async () => {
    if (token) {
      const data = await createComment(token, comment, decision!.id);
      setComments(data);
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (comment.length > 50) return;
    createCommentsData();
    setComment('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center p-4">
      <input
        type="text"
        className="flex-1 p-2 border border-gray-300 rounded-md"
        placeholder="Add a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button
        type="submit"
        className="ml-4 text-blue-500 font-semibold"
        disabled={!comment.trim()}
      >
        Post
      </button>
    </form>
    // <form onSubmit={handleSubmit} className="flex flex-col w-full mb-2 h-[25vh]">
    //   <textarea
    //     className="w-full h-[80%] textarea textarea-warning bg-white mb-2"
    //     value={comment}
    //     onChange={(e) => setComment(e.target.value)}
    //     placeholder="コメントを入力...（最大50文字）"
    //   />
    //   <div className="flex w-full justify-end">
    //     <button type="submit" className="flex h-[20%] btn btn-outline btn-warning">
    //       投稿する
    //     </button>
    //   </div>
    // </form>
  );
};

export { CommentInputForm }