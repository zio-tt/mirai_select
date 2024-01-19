import { useState } from "react";
import { useDecisions } from "@/app/_contexts/DecisionsContext";
import { createComment } from "@/app/_features/fetchAPI/fetchComment";

const CommentInputForm = () => {
  const [comment,  setComment]  = useState<string>('');
  const {comments, setComments} = useDecisions();
  const {selectedDecision}      = useDecisions();
  const {token}                 = useDecisions();

  const createCommentsData = async () => {
    if (token) {
      const data = await createComment(token, comment, selectedDecision!.id);
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
    <form onSubmit={handleSubmit} className="flex flex-col w-full mb-2">
      <textarea
        className="border p-2 rounded mb-2"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="コメントを入力...（最大50文字）"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        コメントする
      </button>
    </form>
  );
};

export { CommentInputForm }