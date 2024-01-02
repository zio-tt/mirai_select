import Image from "next/image";
import { useState, useEffect } from "react";

type CharacterProps = {
  name: string;
  avatar: string | undefined;
}

const CharacterAvatarWindow = ({ name, avatar }: CharacterProps) => {
  /* 開発環境用のコード */
  const [ avatarURL, setAvatarURL ] = useState<string>("/images/logo.png");

  useEffect(() => {
    if (avatar) {
      if (avatar.includes("localhost")){
        setAvatarURL(avatar.replace("localhost", "web"));
      }
    }
  }, []);

  return (
    <div>
      <div className='flex flex-col items-center justify-center m-2'>
        <Image src={avatarURL} className="flex bg-white rounded-lg items-center justify-center"
               alt={name}
               width={50}
               height={50}
         />
        <div className="flex items-center justify-center">{name}</div>
      </div>
    </div>
  );
}

export { CharacterAvatarWindow }