import { CharacterAvatarWindow } from './CharacterAvatarWindow';
import { CharacterTextWindow } from './CharacterTextWindow';
import { Character } from '@/app/_types';

import { useEffect } from 'react';
import { useDrawer } from '@/app/_contexts/DrawerContext';

interface CharacterResponse {
  id:              number;
  conversation_id: number;
  character_id?:   number;
  response:        string;
}

interface CharacterDisplayProps {
  conversationId: number;
  userCharacters?: Character[];
  responses?: CharacterResponse[]
  userDecision: CharacterResponse;
  setUserDecision: (response: CharacterResponse) => void;
  isResponse: boolean;
}

const CharacterDisplay = ({ conversationId, userCharacters, responses, userDecision, setUserDecision, isResponse }: CharacterDisplayProps) => {
  const { isDrawerClick } = useDrawer();

  useEffect(() => {
    if (isDrawerClick) {
      setUserDecision(
        {
          id:              0,
          conversation_id: conversationId,
          character_id:    undefined,
          response:        '',
        }
      );
    }
  }, [isDrawerClick, setUserDecision]);

  const handleCharacterClick = ({
    conversation_id,
    character_id,
    response,
  } : {
    conversation_id: number;
    character_id?:   number;
    response:        string;
  }) => {
    if (isResponse) {
      setUserDecision({
        id:              0,
        conversation_id: conversation_id,
        character_id:    character_id,
        response:        response,
      });
    }
  };

  return (
    <>
      {userCharacters && userCharacters.map((character, index) => {
        // responseはresponsesの中からnameがcharacter.nameと一致するものを取得
        let response = responses && responses.length > 0
                     ? responses.find(response => response.character_id === character.id)?.response
                     : (index === 0 ? character.character1_welcome : character.character2_welcome);

        const isSelected    = userDecision && userDecision.character_id === character.id;
        const isAnySelected = userDecision && userDecision.character_id !== undefined;

        // 各キャラクターに対する borderStyle を動的に計算
        const borderStyle = isSelected ? 'border-red-500' : 'border-black';

        return (
          <div key={character.id} 
               className={`character-response flex h-[30%] w-[90%] text-black p-4 items-center rounded-md  ${isAnySelected && !isSelected ? 'filter grayscale' : ''}`}
               onClick={() => handleCharacterClick({
                conversation_id: conversationId,
                character_id:    character.id,
                response:        response!,
               })}>
            <div className='flex flex-row h-full w-full items-center'>
              <CharacterAvatarWindow name={character.name} avatar={character.avatar} borderStyle={borderStyle} />
              <CharacterTextWindow response={response!} borderStyle={borderStyle} /> 
            </div>
            {!isSelected && <div className="overlay"></div>}
          </div>
        );
      })}
    </>
  );
}

export { CharacterDisplay };