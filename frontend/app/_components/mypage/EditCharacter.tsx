/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unsafe-return */
// components/CharacterDetailModal.tsx
import Image from 'next/image'
import { useState, useEffect } from 'react'
import Avatar from 'react-avatar'

import { useCharacterList } from '@/app/_contexts/CharacterListContext'
import { useDecisions } from '@/app/_contexts/DecisionsContext'
import { Character } from '@/app/_types'

import { ResizeAvatar } from './ResizeAvatar'

interface CharacterDetailModalProps {
  onCancel: () => void
  onUpdateCharacter: (character: Character, avatar?: File) => void
  MBTI_Type: { [key: string]: string }[]
  Tone: { [key: string]: string }[]
  Expression: { [key: string]: string }[]
  Empathy: { [key: string]: string }[]
  iconInputRef: React.RefObject<HTMLInputElement>
  handleChangeAvatar: (iconFile: File | null) => void
  handleClickChangeAvatar: () => void
  handleChangePreviewAvatar: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const EditCharacter = ({
  onCancel,
  onUpdateCharacter,
  MBTI_Type,
  Tone,
  Expression,
  Empathy,
  iconInputRef,
  handleChangeAvatar,
  handleClickChangeAvatar,
  handleChangePreviewAvatar,
}: CharacterDetailModalProps) => {
  const { selectCharacter } = useCharacterList()
  const { avatar, setAvatar } = useCharacterList()
  const { previewAvatar, setPreviewAvatar } = useCharacterList()
  const { avatarUrl, setAvatarUrl } = useCharacterList()
  const [editedCharacter, setEditedCharacter] = useState<Character | null>(
    selectCharacter ? selectCharacter : null,
  )

  console.log('previewAvatar:', previewAvatar)

  const { setIsEdit } = useCharacterList()

  const handleUpdateCharacter = () => {
    if (!editedCharacter) return
    onUpdateCharacter(editedCharacter, avatar!)
  }

  // selectCharacterが更新された場合、各stateを更新する
  useEffect(() => {
    if (!selectCharacter) return
    setEditedCharacter(selectCharacter)
    setAvatarUrl(selectCharacter.avatar ? selectCharacter.avatar : '')
  }, [selectCharacter])

  const changeInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editedCharacter) return
    const target = e.target.id
    const value = e.target.value
    setEditedCharacter({ ...editedCharacter, [target]: value })
  }

  const changeSelectValue = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!editedCharacter) return
    const target = e.target.id
    const value = e.target.value
    setEditedCharacter({ ...editedCharacter, [target]: value })
  }

  const changeTextAreaValue = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!editedCharacter) return
    const target = e.target.id
    const value = e.target.value
    setEditedCharacter({ ...editedCharacter, [target]: value })
  }

  if (!editedCharacter) return null
  return (
    <>
      {previewAvatar && (
        <ResizeAvatar
          onChangePreviewAvatar={setPreviewAvatar}
          onChangeAvatar={handleChangeAvatar}
        />
      )}
      <div className='modal modal-open'>
        <div className='modal-box'>
          <div className='modal-header'>
            <h3 className='font-bold text-lg'>キャラクター情報を編集</h3>
          </div>
          <div className='modal-body'>
            <div className='form-control'>
              <label htmlFor='name'>名前</label>
              <input
                type='text'
                id='name'
                value={editedCharacter.name}
                onChange={(e) => changeInputValue(e)}
              />
            </div>
            <div className='form-control'>
              <div>
                {avatar ? (
                  <>
                    <button
                      className='top-0 border flex items-center justify-center w-16 h-16 rounded-full cursor-pointer'
                      type='button'
                      onClick={handleClickChangeAvatar}
                    >
                      <Avatar
                        size='60'
                        name='アイコン'
                        round
                        color='#ddd'
                        alt='アイコン'
                        src={avatar ? URL.createObjectURL(avatar) : ''}
                      />
                    </button>
                    <input
                      type='file'
                      accept='image/*'
                      style={{ display: 'none' }}
                      ref={iconInputRef}
                      onChange={(e) => handleChangePreviewAvatar(e)}
                    />
                  </>
                ) : (
                  <>
                    <button
                      className='top-0 border flex items-center justify-center w-16 h-16 rounded-full cursor-pointer'
                      type='button'
                      onClick={handleClickChangeAvatar}
                    >
                      <Image
                        src={avatarUrl ? avatarUrl : '/edit-icon.png'}
                        width={40}
                        height={30}
                        alt='アイコン編集'
                      />
                    </button>
                    <input
                      type='file'
                      accept='image/*'
                      style={{ display: 'none' }}
                      ref={iconInputRef}
                      onChange={(e) => handleChangePreviewAvatar(e)}
                    />
                  </>
                )}
              </div>
            </div>
            <div className='form-control'>
              <label htmlFor='mbti_type'>MBTIタイプ</label>
              <select
                id='mbti_type'
                value={editedCharacter.mbti_type}
                onChange={(e) => changeSelectValue(e)}
              >
                {MBTI_Type.map((type, index) => (
                  <option key={index} value={Object.keys(type)[0]}>
                    {Object.values(type)[0]}
                  </option>
                ))}
              </select>
            </div>
            <div className='form-control'>
              <label htmlFor='tone'>話し方</label>
              <select
                id='tone'
                value={editedCharacter.tone}
                onChange={(e) => changeSelectValue(e)}
              >
                {Tone.map((tone, index) => (
                  <option key={index} value={Object.keys(tone)[0]}>
                    {Object.values(tone)[0]}
                  </option>
                ))}
              </select>
            </div>
            <div className='form-control'>
              <label htmlFor='expression'>表現</label>
              <select
                id='expression'
                value={editedCharacter.expression}
                onChange={(e) => changeSelectValue(e)}
              >
                {Expression.map((expression, index) => (
                  <option key={index} value={Object.keys(expression)[0]}>
                    {Object.values(expression)[0]}
                  </option>
                ))}
              </select>
            </div>
            <div className='form-control'>
              <label htmlFor='values'>価値観</label>
              <input
                type='text'
                id='values'
                value={editedCharacter.values}
                onChange={(e) => changeInputValue(e)}
              />
            </div>
            <div className='form-control'>
              <label htmlFor='empathy'>共感度</label>
              <select
                id='empathy'
                value={editedCharacter.empathy}
                onChange={(e) => changeSelectValue(e)}
              >
                {Empathy.map((empathy, index) => (
                  <option key={index} value={Object.keys(empathy)[0]}>
                    {Object.values(empathy)[0]}
                  </option>
                ))}
              </select>
            </div>
            <div className='form-control'>
              <label htmlFor='character1_welcome'>キャラクター1の挨拶</label>
              <textarea
                id='character1_welcome'
                value={editedCharacter.character1_welcome}
                onChange={(e) => changeTextAreaValue(e)}
              />
            </div>
            <div className='form-control'>
              <label htmlFor='character2_welcome'>キャラクター2の挨拶</label>
              <textarea
                id='character2_welcome'
                value={editedCharacter.character2_welcome}
                onChange={(e) => changeTextAreaValue(e)}
              />
            </div>
          </div>
          <div className='modal-action'>
            <button className='btn' onClick={handleUpdateCharacter}>
              保存する
            </button>
            <button className='btn' onClick={onCancel}>
              キャンセル
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export { EditCharacter }
