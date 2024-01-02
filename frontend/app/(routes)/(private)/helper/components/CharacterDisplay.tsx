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
    <div className='w-full h-[60vh] border-2 border-black'>
      { characters && characters.map((character, index) => {
        const response = responses ? responses[index] : null;

        return(
            <div key={character.id} className='character-response flex h-[50%] w-full text-black p-4 items-center'>
              <div className='flex flex-row h-full w-full items-center'>
              <CharacterAvatarWindow name={character.name} avatar={character.avatar}  />
              <CharacterTextWindow response={response} />
              </div>
            </div>
          );
      })}
    </div>
  );
}

export { CharacterDisplay }