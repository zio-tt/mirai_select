interface InputFormProps {
  inputText: string;
  setInputText: (inputText: string) => void;
}

const InputForm = ({ inputText, setInputText } : InputFormProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value);
  }

  return (
    <div className='w-full grow-[3] flex items-center justify-center border-2 border-black mt-3'>
      <textarea
        className='w-full h-full bg-white border-1'
        value={inputText}
        onChange={handleChange}
        placeholder="悩みを入力してください（50文字以内）"
      />
    </div>
  );
}

export { InputForm }