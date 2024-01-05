import { useEffect, useState } from 'react';
import { ResponseData } from '../type/ResponseData';

interface CharacterTextWindowProps {
  response: string | null;
}

const CharacterTextWindow = ({ response }: CharacterTextWindowProps) => {
  const [text, setText] = useState<string>('welcome_textが存在しません。');

  useEffect(() => {
    if (response != null) {
      setText(response);
    } else {
      setText('No response available.');
    }
  }, [response]);

  return (
    <div className='flex flex-grow w-[60%] h-full border-black border-2 items-center justify-center bg-white ml-3 p-2 rounded-md'>
      <p className='text-xl'>{text}</p>
    </div>
  );
}


export { CharacterTextWindow }