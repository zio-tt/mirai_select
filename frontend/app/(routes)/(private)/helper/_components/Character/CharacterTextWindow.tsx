import { useEffect, useState } from 'react';
import { ResponseData } from '../../_types/ResponseData';

interface CharacterTextWindowProps {
  response: string | null;
  borderStyle?: string;
}

const CharacterTextWindow = ({ response, borderStyle }: CharacterTextWindowProps) => {
  const [text, setText] = useState<string>('welcome_textが存在しません。');

  useEffect(() => {
    if (response != null) {
      setText(response);
    } else {
      setText('No response available.');
    }
  }, [response]);

  return (
    <div className={`flex flex-grow w-[60%] h-full border-2 items-center justify-center bg-white ml-3 p-2 rounded-md ${borderStyle}`}>
      <p className='text-lg'>{text}</p>
    </div>
  );
}


export { CharacterTextWindow }