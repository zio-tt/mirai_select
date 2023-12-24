import { useEffect, useState } from 'react';

type ResponseProps = {
  response: string;
}

const CharacterTextWindow = ({ response }: ResponseProps) => {
  const [ text, setText ] = useState<string>('');

  useEffect(() => {
    if (response = '') {
      setText('welcome_textが存在しません');
    } else {
      setText(response);
    }
  }, []);

  return (
    <div className='character-response-window'>
      <p>{response}</p>
    </div>
  );
}

export { CharacterTextWindow }