// InputForm.tsx
import React from 'react';

const InputForm = ({ inputText, onInputChange, remainingChars, onSubmit, isLoading }) => {
  return (
    <div className="flex flex-row w-screen items-center justify-center">
      <div className="form-control w-full max-w-lg">
        <input
          type="text"
          placeholder="悩みごとを入力してください（最大50文字）"
          className="input input-bordered border-black w-full max-w-full"
          value={inputText}
          onChange={onInputChange}
        />
        <label
          className="label text-sm text-base-100"
          style={{ color: remainingChars < 0 ? 'red' : 'black' }}
        >
          残り{remainingChars}文字
        </label>
      </div>
      <div className="h-full items-start justify-start ml-4">
        { !isLoading && <button onClick={onSubmit} className="btn btn-outline">Send</button> }
        { isLoading && <button className="btn btn-outline"><span className="loading loading-spinner"></span>loading</button> }
      </div>
    </div>
  );
};

export default InputForm;
