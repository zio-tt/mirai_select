type TableCellProps = {
  text: string | number;
};

type TagsProps = {
  key: number;
  tag: string;
};

const TableCell = ({ text }: TableCellProps) => {
  const cellStyle = "px-5 py-5 border-b border-gray-200 bg-white text-sm";

  return (
    <td className={cellStyle}>
      <p className="text-gray-900 whitespace-no-wrap">{text}</p>
    </td>
  );
};

const Tags = ({ key, tag }: TagsProps) => {
  return (
    <div key={key} className="badge badge-outline mr-1">{tag}</div>
  )
}

type TableRowProps = {
  first_query: string;
  user_name: string;
  tags: string[];
  comment: number;
  bookmark: number;
};

export const TableRow = ({
  first_query,
  user_name,
  tags,
  comment,
  bookmark,
}: TableRowProps) => {
  return (
    <>
      <TableCell text={first_query} />
      <TableCell text={user_name} />
      <TableCell text={comment} />
      <TableCell text={bookmark} />
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        {tags.map((tag, index) => (
          <Tags key={index} tag={tag} />
        ))}
      </td>
    </>
  );
};
