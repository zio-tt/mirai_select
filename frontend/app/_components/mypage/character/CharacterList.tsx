// components/CharacterList.tsx
import { XMarkIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'
import { useState } from 'react'

import { DraggableCharacter } from '@/app/_components/mypage/character/drag/DraggableCharacter'
import { useDecisions } from '@/app/_contexts/_featureContexts/DecisionsContext'
import { useUserInfo } from '@/app/_contexts/_globalContexts/UserInfoContext'
import { Character, CustomCharacter } from '@/app/_types'

interface CharacterProps {
  characters: Character[]
  charactersList: CustomCharacter[]
  onSelect: (character: Character) => void
  onCreate: () => void
  onDelete: (character: Character) => void
}

export const CharacterList = ({
  characters,
  charactersList,
  onSelect,
  onCreate,
  onDelete,
}: CharacterProps) => {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)
  // ログイン中のユーザー
  const { currentUser } = useUserInfo()
  const [isDelete, setIsDelete] = useState(false)
  const { setIsModalOpen } = useDecisions()
  const userCharacterIds = charactersList
    .filter((character) => character.user_id === currentUser?.id)
    .map((character) => character.character_id)

  interface DeleteModalProps {
    character: Character | null
  }

  const DeleteModal = ({ character }: DeleteModalProps) => {
    if (!character) return null
    return (
      <div className='modal modal-open'>
        <div className='modal-box'>
          <div className='modal-content'>
            <h2>キャラクター削除</h2>
            <p>本当に削除しますか？</p>
            <div className='flex justify-end bottom-1'>
              <button
                className='btn btn-secondary mr-2'
                onClick={() => handleDelete(character)}
              >
                削除する
              </button>
              <button className='btn btn-primary' onClick={handleCancelClick}>
                キャンセル
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const handleDeleteClick = (character: Character) => {
    setIsDelete(true)
    setIsModalOpen(true)
    setSelectedCharacter(character)
  }

  const handleCancelClick = () => {
    setIsDelete(false)
    setIsModalOpen(false)
  }

  const handleDelete = (character: Character) => {
    onDelete(character)
    setIsDelete(false)
    setIsModalOpen(false)
  }

  return (
    <>
      <div className='grid grid-cols-2 lg:grid-cols-7 md:grid-cols-4 sm:grid-cols-3 gap-4 p-4'>
        <div
          className='cursor-pointer flex flex-col items-center justify-center p-2 border rounded w-max-[20%]'
          onClick={onCreate}
        >
          <Image
            src='/edit-icon.png'
            alt='character_create'
            width={100}
            height={100}
            className='flex rounded-full'
          />
          <p className='flex text-center mt-2'>新規作成</p>
        </div>
        {characters
          .sort((a, b) => b.id - a.id)
          .map((character) => (
            <div key={character.id}>
              {userCharacterIds.includes(character.id) && (
                <div className='indicator'>
                  <span
                    className='indicator-item badge badge-error'
                    onClick={() => handleDeleteClick(character)}
                  >
                    <XMarkIcon className='h-4 w-4' />
                  </span>
                  <DraggableCharacter character={character} onSelect={onSelect} />
                </div>
              )}
              {!userCharacterIds.includes(character.id) && (
                <DraggableCharacter character={character} onSelect={onSelect} />
              )}
            </div>
          ))}
      </div>
      {isDelete && <DeleteModal character={selectedCharacter} />}
    </>
  )
}
