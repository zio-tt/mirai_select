import { Bookmark, Character, CharacterResponse, Comment, Conversation, Decision, Tag, User} from "@/app/_types";

interface DecisionIndex extends Decision {
  // id: number;
  // user_id: number;
  // public: boolean;
  // created_at: string;
  // updated_at: string;
  user: User;
  characters: Character[];
  first_query: string;
  conversations: Conversation[];
  character_responses: CharacterResponse[];
  tags: Tag[];
  comments: Comment[];
  bookmarks: Bookmark[];
}

export const DetailDecision = ({ decision }: { decision: DecisionIndex}) => {
  return (
    <>
      <div className="flex flex-col">
        <p>{decision.user.name}</p>
        <p>{decision.first_query}</p>
        <p>{decision.characters[0].name}</p>
        <p>{decision.character_responses[0].response}</p>
      </div>
    </>
  )
}