/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unsafe-return */
// components/CharacterDetailModal.tsx
import Image from 'next/image'
import { useState, useRef, ChangeEvent, useCallback } from 'react'
import Avatar from 'react-avatar'

import { useCharacterList } from '@/app/_contexts/_featureContexts/CharacterListContext'
import { Character } from '@/app/_types'

import { ResizeAvatar } from '../edit/ResizeAvatar'

interface ErrorMessage {
  kind: string
  message: string
}

interface CreateCharacterProps {
  onClose: () => void
  onCreateCharacter: (character: Character, avatar?: File) => void
  MBTI_Type: { [key: string]: string }[]
  Tone: { [key: string]: string }[]
  Expression: { [key: string]: string }[]
  Empathy: { [key: string]: string }[]
  errorMessages: ErrorMessage[]
}

const CreateCharacter = ({
  onClose,
  onCreateCharacter,
  MBTI_Type,
  Tone,
  Expression,
  Empathy,
  errorMessages,
}: CreateCharacterProps) => {
  const [createCharacter, setCreateCharacter] = useState<Character>({
    id: 0,
    name: '',
    mbti_type: 'ISTJ',
    tone: 'polite',
    expression: 'humorous',
    values: '',
    empathy: 'high',
    first_person: '',
    second_person: '',
    character1_welcome: '',
    character2_welcome: '',
    avatar: '',
  })

  const { isEdit, setIsEdit } = useCharacterList()
  const { avatar, setAvatar } = useCharacterList()
  const { previewAvatar, setPreviewAvatar } = useCharacterList()
  const { avatarUrl, setAvatarUrl } = useCharacterList()

  const iconInputRef = useRef<HTMLInputElement | null>(null)

  const handleClickChangeAvatar = useCallback(() => {
    if (!iconInputRef || !iconInputRef.current) return
    iconInputRef.current.click()
  }, [])

  const handleChangePreviewAvatar = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return
    setPreviewAvatar(e.target.files[0])
    e.currentTarget.value = ''
  }, [])

  const handleChangeAvatar = useCallback((iconFile: File | null) => {
    if (!iconFile) return
    setAvatar(iconFile)
  }, [])

  const changeInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!createCharacter) return
    const target = e.target.id
    const value = e.target.value
    setCreateCharacter({ ...createCharacter, [target]: value })
  }

  const changeSelectValue = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!createCharacter) return
    const target = e.target.id
    const value = e.target.value
    setCreateCharacter({ ...createCharacter, [target]: value })
  }

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
            {errorMessages && (
              <>
                {errorMessages.map((error, index) => {
                  return (
                    <div key={index} className='text-red-500'>
                      {error.message}
                    </div>
                  )
                })}
              </>
            )}
          </div>
          <div className='modal-body'>
            <div className='flex flex-col gap-4 w-full'>
              <div className='flex gap-4 items-center'>
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
                <div className='skeleton flex h-16 w-full items-center justify-center border rounded-lg my-2'>
                  <div className='flex text-xl'>
                    <input
                      type='text'
                      id='name'
                      value={createCharacter.name}
                      placeholder='名前（10文字以内）'
                      onChange={(e) => changeInputValue(e)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className='skeleton w-full'>
              <table className='table-fixed border-separate border w-full'>
                <thead>
                  <tr>
                    <th className='w-[30%] border'>属性</th>
                    <th className='w-[65%] border'>値</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className='border text-center'>MBTI（性格）</td>
                    <td className='border overflow-hidden'>
                      <select
                        id='mbti_type'
                        value={createCharacter.mbti_type}
                        onChange={(e) => changeSelectValue(e)}
                      >
                        {MBTI_Type.map((type, index) => (
                          <option key={index} value={Object.keys(type)[0]}>
                            {Object.values(type)[0]}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td className='border text-center'>口調</td>
                    <td className='border'>
                      <select
                        id='tone'
                        value={createCharacter.tone}
                        onChange={(e) => changeSelectValue(e)}
                      >
                        {Tone.map((tone, index) => (
                          <option key={index} value={Object.keys(tone)[0]}>
                            {Object.values(tone)[0]}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td className='border text-center'>表情</td>
                    <td className='border'>
                      <select
                        id='expression'
                        value={createCharacter.expression}
                        onChange={(e) => changeSelectValue(e)}
                      >
                        {Expression.map((expression, index) => (
                          <option key={index} value={Object.keys(expression)[0]}>
                            {Object.values(expression)[0]}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td className='border text-center'>好物・価値観</td>
                    <td className='border'>
                      <input
                        type='text'
                        id='values'
                        value={createCharacter.values}
                        placeholder='好物・価値観（50文字以内）'
                        onChange={(e) => changeInputValue(e)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className='border text-center'>共感性</td>
                    <td className='border'>
                      <select
                        id='empathy'
                        value={createCharacter.empathy}
                        onChange={(e) => changeSelectValue(e)}
                      >
                        {Empathy.map((empathy, index) => (
                          <option key={index} value={Object.keys(empathy)[0]}>
                            {Object.values(empathy)[0]}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td className='border text-center'>一人称</td>
                    <td className='border'>
                      <input
                        type='text'
                        id='first_person'
                        placeholder='一人称（10文字以内）'
                        value={createCharacter.first_person}
                        onChange={(e) => changeInputValue(e)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className='border text-center'>二人称</td>
                    <td className='border'>
                      <input
                        type='text'
                        id='second_person'
                        placeholder='二人称（10文字以内）'
                        value={createCharacter.second_person}
                        onChange={(e) => changeInputValue(e)}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className='modal-action'>
            <button
              className='btn'
              onClick={() => onCreateCharacter(createCharacter, avatar!)}
            >
              保存する
            </button>
            <button className='btn' onClick={onClose}>
              キャンセル
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export { CreateCharacter }
