// components/CharacterList.tsx
import Image from 'next/image'

import { Character } from '@/app/_types'

interface CharacterProps {
  characters: Character[]
  onSelect: (character: Character) => void
}

export const CharacterList = ({ characters, onSelect }: CharacterProps) => {
  return (
    <div className='grid grid-cols-3 gap-4 p-4'>
      {characters.map((character) => (
        <div
          key={character.id}
          className='cursor-pointer p-2 border rounded'
          onClick={() => onSelect(character)}
        >
          <Image
            src={character.avatar}
            alt={character.name}
            width={100}
            height={100}
            className='rounded-full'
          />
          <p className='text-center mt-2'>{character.name}</p>
        </div>
      ))}
    </div>
  )
}
