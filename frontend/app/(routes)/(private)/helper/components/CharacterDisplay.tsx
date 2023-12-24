import { CharacterAvatarWindow } from './CharacterAvatarWindow';
import { CharacterTextWindow } from './CharacterTextWindow';
import { Character } from '@/app/_types';
import { ResponseData } from '../type/ResponseData';

interface CharacterDisplayProps {
  characters?: Character[];
  responses?: ResponseData[];
}

const CharacterDisplay: React.FC<CharacterDisplayProps> = ({ characters, responses }: CharacterDisplayProps) => {
  return (
    <div>
      { characters && characters.map((character) => (
        <div key={character.id} className='character-response flex flex-row'>
          <CharacterAvatarWindow name={character.name} avatar={character.avatar}  />
          <CharacterTextWindow response={character.welcome_text} />
        </div>
      ))}
      {responses && responses.map((response) => (
        <div key={response.character_id} className='character-response flex flex-row'>
          <CharacterAvatarWindow name={response.name} avatar={response.avatar}  />
          <CharacterTextWindow response={response.response} />
        </div>
      ))}
    </div>
  );
}

export { CharacterDisplay }