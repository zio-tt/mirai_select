import Image from 'next/image'
import { useDrop } from 'react-dnd'

import { Character, UserCharacter } from '@/app/_types'

interface DroppableCharacterProps {
  character: Character
  userCharactersList: UserCharacter[]
  onDropCharacter: (draggedCharacterId: number, droppedCharacterId: number) => void
  onSelect: (character: Character) => void
}

const DroppableCharacter = ({
  character,
  userCharactersList,
  onDropCharacter,
  onSelect,
}: DroppableCharacterProps) => {
  const [, drop] = useDrop({
    accept: 'character',
    drop: (item: Character) => {
      onDropCharacter(item.id, character.id)
    },
  })

  const characterRole = userCharactersList.find(
    (userCharacter) => userCharacter.character_id === character.id,
  )?.role

  return (
    <div
      ref={drop}
      key={character.id}
      className='flex flex-col items-center justify-between w-full p-4 border mb-4'
    >
      <div
        className='cursor-pointer flex flex-col items-center justify-center p-2 border rounded w-max-[15%]'
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
      <div className='flex items-center justify-center border mt-2'>
        <div className='p-2 rounded'>
          {characterRole === 'character1' && 'キャラ1'}
          {characterRole === 'character2' && 'キャラ2'}
        </div>
      </div>
    </div>
  )
}

export { DroppableCharacter }
