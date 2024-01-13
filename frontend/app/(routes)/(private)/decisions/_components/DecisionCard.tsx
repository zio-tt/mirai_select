import { Comment, Bookmark } from '@/app/_types';
import { useState, useEffect } from 'react';

type decisionTagsProps = {
  id: number;
  name: string | undefined;
}

type User = {
  id:     number;
  name:   string;
  avatar: string;
}

interface DecisionCardProps {
  decision_id: number;
  query_text: string;
  user: User | undefined;
  comments: Comment[];
  bookmarks: Bookmark[];
  decision_tags: decisionTagsProps[];
}

const DecisionCard = ({ decision_id, query_text, user, comments, bookmarks, decision_tags }: DecisionCardProps) => {
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
          <div className='flex flex-row'>
            {decision_tags.map((decision_tag) => (
              <div key={decision_tag.id.toString()} className="badge badge-outline mt-1 mr-1">{decision_tag.name}</div>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-end items-end">
          <div className="flex text-sm text-gray-500">コメント数: {commentCount}</div>
          <div className="flex text-sm text-gray-500">ブックマーク数: {bookmarkCount}</div>
        </div>
      </div>
    </div>
  );
}

export { DecisionCard };