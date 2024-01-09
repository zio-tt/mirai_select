import { User, Comment, Bookmark } from '@/app/_types';
import { useState, useEffect } from 'react';

interface DecisionCardProps {
  query_text: string;
  user: User;
  comments: Comment[];
  bookmarks: Bookmark[];
}

const DecisionCard = ({ query_text, user, comments, bookmarks }: DecisionCardProps) => {
  const [ commentCount, setCommentCount ] = useState(comments.length);
  const [ bookmarkCount, setBookmarkCount ] = useState(bookmarks.length);

  useEffect(() => {
    setCommentCount(comments.length);
    setBookmarkCount(bookmarks.length);
  }, [comments, bookmarks]);

  return (
    <div className="bg-white shadow-lg rounded-lg p-4">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          <div className="text-lg font-bold">{query_text}</div>
          <div className="text-sm text-gray-500">{user.name}</div>
        </div>
        <div className="flex flex-col">
          <div className="text-sm text-gray-500">コメント数: {commentCount}</div>
          <div className="text-sm text-gray-500">ブックマーク数: {bookmarkCount}</div>
        </div>
      </div>
    </div>
  );
}

export { DecisionCard };