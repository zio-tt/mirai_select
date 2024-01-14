import Image from "next/image";
import { useState, useEffect } from "react";

type CharacterProps = {
  name: string;
  avatar: string | undefined;
  borderStyle?: string;
}

const CharacterAvatarWindow = ({ name, avatar, borderStyle }: CharacterProps) => {
  /* 開発環境用のコード */
  const [ avatarURL, setAvatarURL ] = useState<string>("/images/logo.png");

  useEffect(() => {
    if (avatar) {
      if (avatar.includes("localhost")){
        setAvatarURL(avatar.replace("localhost", "web"));
      } else {
        setAvatarURL(avatar);
      }
    }
  }, []);

  return (
    <div>
      <div className={`flex flex-col w-[5vw] h-full items-center justify-center border-2 p-3 bg-white m-2 rounded-full ${borderStyle}`}>
        <Image src={avatarURL} className='flex bg-white rounded-lg items-center justify-center'
               alt={name}
               width={70}
               height={70}
         />
        <div className="flex items-center justify-center">{name}</div>
      </div>
    </div>
  );
}

export { CharacterAvatarWindow }