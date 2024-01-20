import Image from "next/image";
import { User } from "@/app/_types";

interface UserQueryDisplayProps {
  decisionUser: User;
  queryText: string;
}

const UserQueryDisplay = ({ decisionUser, queryText }: UserQueryDisplayProps) => {
  return (
    <div className="chat chat-start mb-2">
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <Image alt={decisionUser.id.toString()}
                 src={decisionUser.avatar}
                 width={40}
                 height={40}
          />
        </div>
      </div>
      <div className="chat-bubble chat-bubble-accent">
        {queryText}
      </div>
    </div>
  );
}

export { UserQueryDisplay }