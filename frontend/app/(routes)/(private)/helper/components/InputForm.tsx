import { useEffect, useState } from 'react';

interface InputFormProps {
  inputText: string;
  setInputText: (inputText: string) => void;
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  sendText: (e: React.MouseEvent<HTMLElement>) => void;
  placeholder: string;
}

const InputForm = ({ inputText, setInputText, handleChange, sendText, placeholder } : InputFormProps) => {
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
        className='ml-5 w-[70%] h-[80%] bg-white border-2 border-black text-xl text-black'
        value={inputText}
        onChange={handleChange}
        placeholder={placeholder}
      />
      <div id='send-button' className='flex flex-col w-[30%] items-center justify-center mb-5'>
        <p className={`flex font-extrabold ${textColor}`}>
          {alertText}
        </p>
        <button className='flex btn btn-lg w-[70%] bg-white text-2xl text-black' onClick={sendText}>相談する</button>
      </div>
    </>
  );
}

export { InputForm }