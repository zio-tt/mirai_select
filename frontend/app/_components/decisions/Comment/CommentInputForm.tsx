import { useState } from 'react';

const CommentInputForm = ({ onSubmit } : { onSubmit: (comment: string) => void }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(comment);
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