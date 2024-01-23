import Image from "next/image";
import { useState, useEffect, use } from "react";
import { Character } from "@/app/_types";

interface CharacterResponse {
  id:              number;
  conversation_id: number;
  character_id?:   number;
  response:        string;
}

interface SelectedResponseProps {
  decisionCharacter?: Character;
  characterResponse?: CharacterResponse | null;
}

const SelectedResponse = ({
  decisionCharacter,
  characterResponse,
}: SelectedResponseProps) => {
  const [ avatarURL, setAvatarURL ] = useState<string>("/images/logo.png");

  useEffect(() => {
    if (!decisionCharacter) { return; }
    const avatar = decisionCharacter.avatar;
    if (avatar) {
      if (avatar.includes("localhost")){
        setAvatarURL(avatar.replace("localhost", "web"));
      } else {
        setAvatarURL(avatar);
      }
    }
  }, []);

  if (!decisionCharacter || !characterResponse) { return null; }
  return (
    <div className="chat chat-start w-[90%] mb-3">
      <div className='w-10 rounded-full chat-image avatar mr-2 p-1 ring ring-primary ring-offset-1 bg-white'>
        <Image alt={decisionCharacter.name}
               src={avatarURL}
               width={30}
               height={30}
               className="rounded-full"
        />
      </div>
      <div className='chat-header'>
        {decisionCharacter.name}
      </div>
      <div className='chat-bubble chat-bubble-secondary'>
        {characterResponse!.response}
      </div>
    </div>
  );
}

export { SelectedResponse }