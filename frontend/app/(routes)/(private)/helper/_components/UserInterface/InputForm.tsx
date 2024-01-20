import { useEffect, useState } from 'react';

interface CharacterResponse {
  conversation_id: number;
  character_id?:   number;
  response:        string;
}
interface InputFormProps {
  inputText: string;
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  sendText: (e: React.MouseEvent<HTMLElement>) => Promise<void>;
  token: string;
  decisionId: number;
  characterResponses: CharacterResponse[];
}

const InputForm = ({
  inputText,
  handleChange,
  sendText,
  placeholder,
  token,
  decisionId,
  characterResponses,
} : InputFormProps) => {
  const [ textColor, setTextColor ] = useState('text-black');
  const [ alertText, setAlertText ] = useState('');

  useEffect(() => {
    if (inputText.length > 50) {
      setTextColor('text-red-500');
      setAlertText('文字数が50文字を超えています。');
    } else {
      setTextColor('text-black');
      setAlertText(`入力中の文字数：${inputText.length}`);
    }
  }, [inputText]);

  return (
    <>
      <textarea
        id='input-text'
        className='ml-5 w-[70%] h-[80%] bg-white border-2 border-black text-xl text-black'
        value={inputText}
        onChange={handleChange}
        placeholder={placeholder}
      />
      <div id='send-button' className='flex flex-col w-[30%] items-center justify-center mb-5'>
        <p className={`flex font-extrabold ${textColor}`}>
          {alertText}
        </p>
        <button 
          className='flex btn btn-lg w-[70%] bg-white text-2xl text-black hover:text-white' 
          onClick={(e) => sendText(e)}
        >
          相談する
        </button>
      </div>
    </>
  );
}

export { InputForm }