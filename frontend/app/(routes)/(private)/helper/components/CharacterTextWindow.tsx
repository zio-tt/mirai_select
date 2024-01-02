import { useEffect, useState } from 'react';
import { ResponseData } from '../type/ResponseData';

interface CharacterTextWindowProps {
  response: ResponseData | null;
}

const CharacterTextWindow = ({ response }: CharacterTextWindowProps) => {
  const [text, setText] = useState<string>('welcome_textが存在しません。');

  useEffect(() => {
    if (response) {
      setText(response.response);
    } else {
      setText('No response available.');
    }
  }, [response]);

  return (
    <div className='flex flex-grow w-[60%] h-[75] items-center justify-center bg-white ml-3 p-2'>
      <p>{text}</p>
    </div>
  );
}


export { CharacterTextWindow }