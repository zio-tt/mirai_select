import { Comment, Bookmark } from '@/app/_types';
import { useDecisions } from '@/app/_contexts/DecisionsContext';

type decisionTagsProps = {
  id: number;
  name: string | undefined;
}
interface DecisionCardProps {
  query_text: string;
  comments: Comment[] | null;
  bookmarks: Bookmark[] | null;
  decision_tags: decisionTagsProps[] | null;
}

const DecisionCard = ({ query_text, comments, bookmarks, decision_tags }: DecisionCardProps) => {
  return (
    <div className="w-full bg-white shadow-lg rounded-lg p-4">
      <div className="w-full flex flex-row justify-between">
        <div className="w-[75%] flex flex-col">
          <div className="text-lg font-bold">{query_text}</div>
          <div className='flex flex-row'>
            {decision_tags!.map((decision_tag) => (
              <div key={decision_tag.id.toString()} className="badge badge-outline mt-1 mr-1">{decision_tag.name}</div>
            ))}
          </div>
        </div>
        <div className="w-[25%] flex flex-col justify-end items-end">
          <div className="flex text-sm text-gray-500">
            コメント数: {comments?.length || 0}
          </div>
          <div className="flex text-sm text-gray-500">
            ブックマーク数: {bookmarks?.length || 0}
          </div>
        </div>
      </div>
    </div>
  );
}

export { DecisionCard };