/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unsafe-return */
// components/CharacterDetailModal.tsx
import { useRef, ChangeEvent, useCallback } from 'react'

import { CharacterInfoDisplay } from '@/app/_components/mypage/character/show/CharacterInfoDisplay'
import { useCharacterList } from '@/app/_contexts/_featureContexts/CharacterListContext'
import { Character, CustomCharacter } from '@/app/_types'

import { EditCharacter } from './edit/EditCharacter'

interface ErrorMessage {
  kind: string
  message: string
}

interface CharacterDetailModalProps {
  onClose: () => void
  onUpdateCharacter: (character: Character, avatar?: File) => void
  errorMessages: ErrorMessage[]
  setErrorMessages: (message: ErrorMessage[]) => void
  MBTI_Type: { [key: string]: string }[]
  Tone: { [key: string]: string }[]
  Expression: { [key: string]: string }[]
  Empathy: { [key: string]: string }[]
}

const CharacterDetailModal = ({
  onClose,
  onUpdateCharacter,
  errorMessages,
  setErrorMessages,
  MBTI_Type,
  Tone,
  Expression,
  Empathy,
}: CharacterDetailModalProps) => {
  const { isEdit, setIsEdit } = useCharacterList()
  const { avatar, setAvatar } = useCharacterList()
  const { previewAvatar, setPreviewAvatar } = useCharacterList()

  const iconInputRef = useRef<HTMLInputElement | null>(null)

  // 編集するボタンを押すと各値を編集できるようにする
  const onEdit = () => {
    setIsEdit(true)
    setErrorMessages([])
  }

  const onCancel = () => {
    setIsEdit(false)
    setErrorMessages([])
  }

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

  if (isEdit) {
    return (
      <EditCharacter
        onCancel={onCancel}
        onUpdateCharacter={onUpdateCharacter}
        MBTI_Type={MBTI_Type}
        Tone={Tone}
        Expression={Expression}
        Empathy={Empathy}
        errorMessages={errorMessages}
        iconInputRef={iconInputRef}
        handleChangeAvatar={handleChangeAvatar}
        handleClickChangeAvatar={handleClickChangeAvatar}
        handleChangePreviewAvatar={handleChangePreviewAvatar}
      />
    )
  } else {
    return (
      <CharacterInfoDisplay
        onClose={onClose}
        onEdit={onEdit}
        MBTI_Type={MBTI_Type}
        Tone={Tone}
        Expression={Expression}
        Empathy={Empathy}
      />
    )
  }
}

export { CharacterDetailModal }
