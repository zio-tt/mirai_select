import { CharacterAvatarWindow } from './CharacterAvatarWindow';
import { CharacterTextWindow } from './CharacterTextWindow';
import { Character } from '@/app/_types';
import { ResponseData } from '../type/ResponseData';

interface CharacterProps extends Character {
  avatar: string;
}

interface CharacterDisplayProps {
  characters?: CharacterProps[];
  responses?: string[];
}

const CharacterDisplay = ({ characters, responses }: CharacterDisplayProps) => {
  return (
    <>
      { characters && characters.map((character, index) => {
        const response = responses ? responses[index] : null;

        return(
            <div key={character.id} className='character-response flex h-[30%] w-[90%] text-black p-4 items-center rounded-md'>
              <div className='flex flex-row h-full w-full items-center'>
                <CharacterAvatarWindow name={character.name} avatar={character.avatar}  />
                <CharacterTextWindow response={response} /> 
              </div>
            </div>
          );
      })}
    </>
  );
}

export { CharacterDisplay }