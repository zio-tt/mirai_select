/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unsafe-return */
// components/CharacterDetailModal.tsx
import { useState, useRef, ChangeEvent, useCallback } from 'react'

import { useCharacterList } from '@/app/_contexts/CharacterListContext'
import { Character } from '@/app/_types'

import { CharacterInfoDisplay } from './CharacterInfoDisplay'
import { EditCharacter } from './EditCharacter'
import { ResizeAvatar } from './ResizeAvatar'

interface CharacterDetailModalProps {
  onClose: () => void
  onUpdateCharacter: (character: Character, avatar?: File) => void
}

const CharacterDetailModal = ({
  onClose,
  onUpdateCharacter,
}: CharacterDetailModalProps) => {
  const { selectCharacter, setSelectCharacter } = useCharacterList()
  const { isEdit, setIsEdit } = useCharacterList()
  const { avatar, setAvatar } = useCharacterList()
  const { previewAvatar, setPreviewAvatar } = useCharacterList()

  const iconInputRef = useRef<HTMLInputElement | null>(null)

  // 編集画面においてプルダウンで表示する内容を配列で作成しておく
  // バックエンドに送る内容は英語だが、表示する内容は日本語にしたいのでオブジェクト型の配列で作成する
  // MBTI_Typeの日本語はISTJ: 管理者。実用的で事実に基づいた思考の持ち主。の様に表記する
  // mbti_type
  const MBTI_Type: { [key: string]: string }[] = [
    { ISTJ: 'ISTJ(管理者)：実用的で事実に基づいた思考の持ち主。' },
    { ISFJ: 'ISFJ(擁護者)：非常に献身的で心の温かい擁護者。' },
    {
      INFJ: 'INFJ(提唱者)：物静かで神秘的だが、人々を非常に勇気づける飽くなき理想主義者',
    },
    { INTJ: 'INTJ(建築家)：想像力が豊かで、戦略的な思考の持ち主。' },
    { ISTP: 'ISTP(巨匠)：大胆で実践的な思考を持つ実験者。' },
    { ISFP: 'ISFP(冒険家)：柔軟性と魅力がある芸術家。' },
    { INFP: 'INFP(仲介者)：詩人肌で親切な利他主義者。' },
    { INTP: 'INTP(論理学者)：貪欲な知識欲を持つ革新的な発明家' },
    { ESTP: 'ESTP(起業家)：賢くてエネルギッシュで、非常に鋭い知覚の持ち主。' },
    {
      ESFP: 'ESFP(エンターテイナー)：自発性がありエネルギッシュで熱心なエンターテイナー。',
    },
    { ENFP: 'ENFP(運動家)：情熱的で独創力があり、かつ社交的な自由人。' },
    { ENTP: 'ENTP(討論者)：賢くて好奇心旺盛な思考家。' },
    {
      ESTJ: 'ESTJ(幹部)：優秀な管理者で、物事や人々を管理する能力にかけては、右に出る者はいない。',
    },
    { ESFJ: 'ESFJ(領事)：非常に思いやりがあり社交的で、人気がある。' },
    { ENFJ: 'ENFJ(主人公)：カリスマ性があり、人々を励ますリーダー。' },
    { ENTJ: 'ENTJ(指揮官)：大胆で想像力豊か、かつ強い意志を持つ指導者。' },
  ]
  // tone
  const Tone: { [key: string]: string }[] = [
    { polite: '丁寧' },
    { calm: '落ち着いた' },
    { casual: 'カジュアル' },
    { energetic: '活発' },
    { confident: '自信がある' },
    { logical: '論理的' },
  ]
  // expression
  const Expression: { [key: string]: string }[] = [
    { humorous: 'ユーモア' },
    { sarcastic: '皮肉' },
    { passionate: '情熱的' },
    { creative: '創造的' },
    { proactive: '積極的' },
    { passive: '消極的' },
    { emotional: '感情的' },
    { serious: '真面目' },
    { irresponsible: '不真面目' },
    { negative: 'ネガティブ' },
    { positive: 'ポジティブ' },
    { kind: '優しい' },
    { strict: '厳しい' },
  ]
  // empathy
  const Empathy: { [key: string]: string }[] = [
    { high: '高い' },
    { moderate: '普通' },
    { low: '低い' },
  ]
  // 編集するボタンを押すと各値を編集できるようにする
  const onEdit = () => {
    setIsEdit(true)
  }

  const onCancel = () => {
    setIsEdit(false)
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
