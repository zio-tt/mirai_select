import Image from "next/image";
import { useState, useEffect } from "react";
import { Character } from "@/app/_types";

interface CharacterResponse {
  conversation_id: number;
  character_id?:   number;
  response:        string;
}

interface CharacterResponseDisplayProps {
  decisionCharacter: Character;
  characterResponse: CharacterResponse;
}

const CharacterResponseDisplay = (
  { decisionCharacter, characterResponse }: CharacterResponseDisplayProps
) => {
  const [ avatarURL, setAvatarURL ] = useState<string>("/images/logo.png");

  useEffect(() => {
    const avatar = decisionCharacter.avatar;
    if (avatar) {
      if (avatar.includes("localhost")){
        setAvatarURL(avatar.replace("localhost", "web"));
      } else {
        setAvatarURL(avatar);
      }
    }
  }, []);

  return (
    <div className="chat chat-start">
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <Image alt={decisionCharacter.name}
                 src={avatarURL}
                 width={40}
                 height={40}
          />
        </div>
      </div>
      <div className="chat-header">
        {decisionCharacter.name}
      </div>
      <div className="chat-bubble">{characterResponse.response}</div>
    </div>
  );
}

export { CharacterResponseDisplay }