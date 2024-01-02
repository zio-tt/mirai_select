import { CharacterAvatarWindow } from './CharacterAvatarWindow';
import { CharacterTextWindow } from './CharacterTextWindow';
import { Character } from '@/app/_types';
import { ResponseData } from '../type/ResponseData';

interface CharacterProps extends Character {
  avatar: string;
}

interface CharacterDisplayProps {
  characters?: CharacterProps[];
  responses?: ResponseData[];
}

const CharacterDisplay = ({ characters, responses }: CharacterDisplayProps) => {
  return (
    <div className='w-full h-[60vh] border-2 border-black'>
      { characters && characters.map((character) => {
        const response = responses?.find(r => r.name === character.name) || null;

        return(
            <div key={character.id} className='character-response flex flex-row text-black m-4'>
              <CharacterAvatarWindow name={character.name} avatar={character.avatar}  />
              <CharacterTextWindow response={response} />
            </div>
          );
      })}
    </div>
  );
}

export { CharacterDisplay }