import { CharacterAvatarWindow } from './CharacterAvatarWindow';
import { CharacterTextWindow } from './CharacterTextWindow';
import { Character } from '@/app/_types';

import { useState, useEffect } from 'react';
import { useHelper } from '@/app/_contexts/HelperContext';
import { set } from 'zod';
import exp from 'constants';

interface CharacterProps extends Character {
  avatar: string;
}

interface CharacterDisplayProps {
  characters?: CharacterProps[];
  responses?: string[]
  userDecision: number;
  setUserDecision: (id: number) => void;
  isResponse: boolean;
}

const CharacterDisplay = ({ characters, responses, userDecision, setUserDecision, isResponse }: CharacterDisplayProps) => {
  const { isDrawerClick } = useHelper();

  useEffect(() => {
    if (isDrawerClick) {
      setUserDecision(0); // DrawerがクリックされたときにuserDecisionをリセット
    }
  }, [isDrawerClick, setUserDecision]); // setUserDecisionを依存配列に追加

  const handleCharacterClick = (id: number) => {
    if (isResponse) {
      setUserDecision(id);
    }
  };

  return (
    <>
      {characters && characters.map((character, index) => {
        let response = responses && responses.length > 0
                     ? responses[index]
                     : (index === 0 ? character.character1_welcome : character.character2_welcome);

        const isSelected = userDecision === character.id;
        const isAnySelected = userDecision !== 0; // いずれかのキャラクターが選択されているか

        // 各キャラクターに対する borderStyle を動的に計算
        const borderStyle = isSelected ? 'border-red-500' : 'border-black';

        return (
          <div key={character.id} 
               className={`character-response flex h-[30%] w-[90%] text-black p-4 items-center rounded-md  ${isAnySelected && !isSelected ? 'filter grayscale' : ''}`}
               onClick={() => handleCharacterClick(character.id)}>
            <div className='flex flex-row h-full w-full items-center'>
              <CharacterAvatarWindow name={character.name} avatar={character.avatar} borderStyle={borderStyle} />
              <CharacterTextWindow response={response} borderStyle={borderStyle} /> 
            </div>
            {!isSelected && <div className="overlay"></div>}
          </div>
        );
      })}
    </>
  );
}

export { CharacterDisplay };