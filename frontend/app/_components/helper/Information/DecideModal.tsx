import { User, Character } from "@/app/_types";
import { UserQueryDisplay } from "./UserQueryDisplay";
import { SelectedResponse } from "./SelectedResponse";
import { useHelper } from "@/app/_contexts/HelperContext";
import { useState } from "react";

interface CharacterResponse {
  id:              number;
  conversation_id: number;
  character_id?:   number;
  response:        string;
}

const DecideModal = ({
  isOpen,
  onClose,
  currentUser,
  characters,
  beforeQueryText,
  beforeUserDecision,
  queryText,
  userDecision,
  onConfirm,
}: {
  isOpen:             boolean;
  onClose:            () => void;
  currentUser:        User;
  characters:         Character[];
  beforeQueryText:    string;
  beforeUserDecision: CharacterResponse;
  queryText:          string;
  userDecision:       CharacterResponse;
  onConfirm:          (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
}) => {
  const { conversationCount } = useHelper();
  const [ isConfirmContent, setIsConfirmContent ] = useState(false);
  // モーダルのコンテンツをクリックしたときにイベントの伝播を止める
  const handleModalContentClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  if (!isOpen) { return null; }
  return (
    <>
      <div className='fixed inset-0 flex items-center justify-center z-40'>
        <div className='fixed inset-0 bg-black bg-opacity-50 z-60'/>
        {/* ここをクリックしても何も起きないようにstopPropagationを呼び出す */}
        <div className="fixed flex w-full h-full items-center justify-center z-50" onClick={onClose}>
          <div className="flex flex-col w-[50%] h-[80%] bg-white p-5 rounded-lg items-center mr-2" onClick={handleModalContentClick}>
            <div className="modal-content">
              <div className="text-lg mb-3" onClick={() => {setIsConfirmContent(!isConfirmContent)}}>内容を確認する</div>
              {isConfirmContent && conversationCount == 2 && (
                <div className="flex w-[80%] h-[50%] border">
                  <UserQueryDisplay decisionUser={currentUser} queryText={beforeQueryText} />
                  <SelectedResponse decisionCharacter={characters.find((c)=> c.id == userDecision.character_id)} characterResponse={userDecision} />
                </div>
              )}
              {isConfirmContent && conversationCount == 3 && (
                <>
                  <UserQueryDisplay decisionUser={currentUser} queryText={beforeQueryText} />
                  <SelectedResponse decisionCharacter={characters.find((c)=> c.id == beforeUserDecision.character_id)} characterResponse={beforeUserDecision} />
                  <UserQueryDisplay decisionUser={currentUser} queryText={queryText} />
                  <SelectedResponse decisionCharacter={characters.find((c)=> c.id == userDecision.character_id)} characterResponse={beforeUserDecision} />
                </>
              )}
              <button className='btn btn-success' onClick={onConfirm}>OK</button>
              <button className='btn btn-error' onClick={onClose}>キャンセル</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export { DecideModal }