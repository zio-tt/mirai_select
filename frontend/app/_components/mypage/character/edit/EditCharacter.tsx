/* eslint-disable no-irregular-whitespace */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unsafe-return */
// components/CharacterDetailModal.tsx
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import Avatar from 'react-avatar'

import { useCharacterList } from '@/app/_contexts/_featureContexts/CharacterListContext'
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
  errorMessage: string
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
  errorMessage,
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

  const { setIsEdit } = useCharacterList()

  const scrollRef = useRef<HTMLDivElement>(null)

  const handleUpdateCharacter = () => {
    if (!editedCharacter) return
    onUpdateCharacter(editedCharacter, avatar!)
  }

  // errorMessageが""でない場合、一番上にスクロールする
  useEffect(() => {
    if (errorMessage && scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [errorMessage])

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
            {errorMessage && (
              <p className='text-red-500' ref={scrollRef}>
                {errorMessage}
              </p>
            )}
            <table className='table-auto border-separate border-spacing-1 w-full'>
              <thead>
                <tr>
                  <th></th>
                  <th></th>
                </tr>
                <tr>
                  <td className='text-sm flex items-start'>1.</td>
                  <td className='text-sm'>変更したい項目をクリックしてください</td>
                </tr>
                <tr>
                  <td className='text-sm flex items-start'>2.</td>
                  <td className='text-sm'>
                    入力フォームに変更後の内容を入力するか、
                    <br />
                    プルダウンからお好きな選択肢を選択してください
                  </td>
                </tr>
                <tr>
                  <td className='text-sm flex items-start'>3.</td>
                  <td className='text-sm'>
                    モーダル下部の「保存する」ボタンを押してください
                    <br />
                    （全フォームに値が入力されていない場合は保存できません）
                  </td>
                </tr>
              </thead>
            </table>
          </div>
          <div className='modal-body'>
            {/* CharacterInfoDisplayと同じレイアウトに変更 */}
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
                      value={editedCharacter.name}
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
                        value={editedCharacter.mbti_type}
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
                        value={editedCharacter.tone}
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
                        value={editedCharacter.expression}
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
                    <td className='border text-center'>価値観</td>
                    <td className='border'>
                      <input
                        type='text'
                        id='values'
                        value={editedCharacter.values}
                        onChange={(e) => changeInputValue(e)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className='border text-center'>共感性</td>
                    <td className='border'>
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
                    </td>
                  </tr>
                  <tr>
                    <td className='border text-center'>一人称</td>
                    <td className='border'>
                      <input
                        type='text'
                        id='first_person'
                        value={editedCharacter.first_person}
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
                        value={editedCharacter.second_person}
                        onChange={(e) => changeInputValue(e)}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className='form-control border px-2'>
              <div className='form-control mb-1'>
                <label htmlFor='character1_welcome' className='text-sm'>
                  キャラクター1に設定した時の挨拶
                </label>
                <textarea
                  id='character1_welcome'
                  value={editedCharacter.character1_welcome}
                  onChange={(e) => changeTextAreaValue(e)}
                  className='border m-1 p-1'
                />
              </div>
              <div className='form-control mb-1'>
                <label htmlFor='character2_welcome' className='text-sm'>
                  キャラクター2に設定した時の挨拶
                </label>
                <textarea
                  id='character2_welcome'
                  value={editedCharacter.character2_welcome}
                  onChange={(e) => changeTextAreaValue(e)}
                  className='border m-1 p-1'
                />
              </div>
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
