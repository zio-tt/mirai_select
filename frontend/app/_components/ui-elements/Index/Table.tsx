import { TableHeader } from "./TableHeader"
import { TableRow } from "./TableRow"
import { Bookmark, Comment, Character, Conversation, Tag, User, Decision } from "@/app/_common/types"

interface DecisionIndex extends Decision {
  user: User;
  characters: Character[];
  first_query: string;
  conversations: Conversation[];
  tags: Tag[];
  comments: Comment[];
  bookmarks: Bookmark[];
}

type TableProps = {
  header: string[];
  data: DecisionIndex[];
}

export const Table = ({header, data} : TableProps) => {
  return (
    <>
      <table className="min-w-full bg-white">
        <thead>
          { header.map((header) => (
            <TableHeader header={header} />
          ))}
        </thead>
        <tbody>
          { data.map((data) => (
            <tr>
              <TableRow
                key={data.id} // ユニークな key プロパティを追加
                first_query={data.first_query}
                user_name={data.user.name}
                tags={data.tags.map((tag) => tag.name)}
                comment={data.comments.length}
                bookmark={data.bookmarks.length}
              />
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}