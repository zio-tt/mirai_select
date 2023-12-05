import "@/app/_common/styles/inputForm.css";
import { useHelper } from "@/app/_features/helper/HelperContext";
import { useAutoResizeTextArea } from '@/app/_common/hooks/useAutoResizeTextArea';

type InputFormProps = {
  isLoading: boolean;
};

const InputForm = ({ isLoading }: InputFormProps) => {
  const { textAreaRef } = useAutoResizeTextArea();
  const { inputText, setInputText } = useHelper();

  return (
    <div className="thought-bubble w-[30%] flex flex-col items-center justify-center mr-10">
      <div className="form-control w-full max-w-lg p-4">
        <textarea
          ref={textAreaRef}
          placeholder="悩みごとを入力してください（最大50文字）"
          className="input resize-none p-2 w-full max-w-full h-8 text-base leading-normal"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
      </div>
      <div className="h-full items-start justify-start ml-4">
        { /* !isLoading && <button onClick={() => onSubmit(value)} className="btn btn-outline">Send</button> */ }
        { isLoading && <button className="btn btn-outline"><span className="loading loading-spinner"></span>loading</button> }
      </div>
    </div>
  );
};

export default InputForm;
