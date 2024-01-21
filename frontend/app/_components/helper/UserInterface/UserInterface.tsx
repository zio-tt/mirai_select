import { useState, useEffect } from "react";

interface UserInterfaceProps {
  tags: string[];
  setTags: (tags: string[]) => void;
  isPublic: boolean;
  setIsPublic: (isPublic: boolean) => void;
  saveDecision: (e: React.MouseEvent<HTMLElement>) => void;
}

const UserInterface = ({ tags, setTags, isPublic, setIsPublic, saveDecision }: UserInterfaceProps) => {
  const [ inputTags, setInputTags ] = useState<string>('');
  const [ labelBgColor, setLabelBgColor ] = useState<string>('bg-blue-100');
  const [ labelTextColor, setLabelTextColor ] = useState<string>('text-blue-800');
  const [ alert, setAlert ] = useState<string[]>([]);
  const [ isTagAlert, setIsTagAlert ] = useState<boolean>(false);

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputTags(e.target.value);
    const inputTags = e.target.value.split(',').map(tag => tag.slice(0, 10).trim());
    // タグの個数が6個以下、各タグの文字数が10文字以下であることを確認
    const newTags = inputTags.slice(0, 6);
    setTags(newTags);
  };

  const handlePublicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsPublic(e.target.checked);
  };

  useEffect(() => {
    if (inputTags.split(',').length > 6 && !alert.includes('タグの個数が6個を超えています。')) {
      // alertMessagesに「タグの個数が6個を超えています。」がない場合追加
        const alertMessages = [...alert, 'タグの個数が6個を超えています。']
        setAlert(alertMessages);
        setLabelBgColor('bg-red-400');
        setLabelTextColor('text-red-800');
        setIsTagAlert(true);
    } else if (inputTags.split(',').some(tag => tag.length > 10) && !alert.includes('タグの文字数が10文字を超えています。')) {
      const alertMessages = [...alert, 'タグの文字数が10文字を超えています。']
      setLabelBgColor('bg-red-400');
      setLabelTextColor('text-red-800');
      setAlert(alertMessages);
      setIsTagAlert(true);
    // 空白のタグを許容しない
    } else if (inputTags.split(',').some(tag => tag.length === 0) && !alert.includes('空白のタグは許容されません。')) {
      const alertMessages = [...alert, '空白のタグは許容されません。']
      setLabelBgColor('bg-red-400');
      setLabelTextColor('text-red-800');
      setAlert(alertMessages);
      setIsTagAlert(true);
    } else if (inputTags.split(',').length <= 6 && inputTags.split(',').every(tag => tag.length <= 10 && tag.length > 0)) {
      setLabelBgColor('bg-blue-100');
      setLabelTextColor('text-blue-800');
      setAlert([]);
      setIsTagAlert(false);
    }
  }, [inputTags]);

  return (
    <div className='w-full h-full flex flex-col justify-end space-y-4'>
      {/* タグ表示領域 */}
      <div className='w-[70%] mx-auto my-4 bg-gray-100 p-2 rounded-lg flex-grow overflow-auto'>
        {tags.map((tag, index) => (
          <div key={index} className={`text-xs font-semibold mb-2 px-2.5 py-1 rounded ${labelTextColor} ${labelBgColor}`}>
            {tag}
          </div>
        ))}
      </div>
      { isTagAlert && (
        <div className='w-[70%] mx-auto text-red-600'>{alert}</div>
      )}
      {/* タグ入力 */}
      <div className='w-[70%] mx-auto'>
        <label className="label">
          <span className="label-text text-md text-black">カンマ区切りでタグを入力</span>
        </label>
        <input type="text"
               id="tags"
               className="bg-gray-50 border border-gray-300 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
               placeholder="最大6個、各10文字まで"
               value={inputTags}
               onChange={handleTagChange} />
      </div>

      {/* 保存ボタンと公開設定 */}
      <div className='w-[70%] mx-auto flex flex-col items-end space-y-2 mb-4'>
        <button className='btn btn-lg w-full text-2xl bg-white text-black hover:text-white' onClick={saveDecision}>決断する</button>
        <label className="label cursor-pointer space-x-2">
          <span className="label-text text-md text-black">全体に公開する</span>
          <input type="checkbox" className="checkbox checkbox-primary" checked={isPublic} onChange={handlePublicChange} />
        </label>
      </div>
    </div>
  );
}

export { UserInterface };