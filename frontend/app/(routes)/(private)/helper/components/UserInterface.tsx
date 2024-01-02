import { useState } from "react"
import { InputForm } from "./InputForm"

interface InputFormProps {
  inputText: string;
  setInputText: (inputText: string) => void;
}

const UserInterface = ({ inputText, setInputText} : InputFormProps) => {
  return (
    <div className='w-full flex flex-col items-center justify-center'>
      <InputForm
        inputText={inputText}
        setInputText={setInputText}
      />
    </div>
  );
}

export { UserInterface }