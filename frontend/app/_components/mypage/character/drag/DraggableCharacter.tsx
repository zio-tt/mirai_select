import Image from 'next/image'
import { useDrag } from 'react-dnd'

import { Character } from '@/app/_types'

interface DraggableCharacterProps {
  character: Character
  onSelect: (character: Character) => void
}

const DraggableCharacter = ({ character, onSelect }: DraggableCharacterProps) => {
  const [, drag] = useDrag(() => ({
    type: 'character',
    item: { id: character.id },
  }))

  return (
    <div
      ref={drag}
      className='cursor-pointer flex flex-col items-center justify-center p-2 border rounded'
      onClick={() => onSelect(character)}
    >
      <Image
        src={character.avatar}
        alt={character.name}
        width={100}
        height={100}
        className='flex rounded-full'
      />
      <p className='flex text-center mt-2'>{character.name}</p>
    </div>
  )
}

export { DraggableCharacter }
