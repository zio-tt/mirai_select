/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unsafe-return */
// components/CharacterDetailModal.tsx
import Image from 'next/image'
import { useState, useEffect } from 'react'

import { editCharacter } from '@/app/_features/fetchAPI'
import { Character } from '@/app/_types'

import { Loading } from '../layouts/loading/layout'

interface CharacterDetailModalProps {
  token: string
  replaceAvatar: (characters: Character[]) => Character[]
  character: Character
  characters: Character[]
  setCharacters: (characters: Character[]) => void
  onClose: () => void
}

const CharacterDetailModal = ({
  token,
  replaceAvatar,
  character,
  setCharacters,
  onClose,
}: CharacterDetailModalProps) => {
  const [selectCharacter, setSelectCharacter] = useState<Character>(character)
  const [isEdit, setIsEdit] = useState<boolean>(false)

  const [name, setName] = useState<string>(character.name)
  const [avatar, setAvatar] = useState<File | null>(null)
  const [mbtiType, setMbtiType] = useState<string>(character.mbti_type)
  const [tone, setTone] = useState<string>(character.tone)
  const [expression, setExpression] = useState<string>(character.expression)
  const [values, setValues] = useState<string>(character.values)
  const [empathy, setEmpathy] = useState<string>(character.empathy)
  const [character1Welcome, setCharacter1Welcome] = useState<string>(
    character.character1_welcome,
  )
  const [character2Welcome, setCharacter2Welcome] = useState<string>(
    character.character2_welcome,
  )

  // 編集画面においてプルダウンで表示する内容を配列で作成しておく
  // バックエンドに送る内容は英語だが、表示する内容は日本語にしたいのでオブジェクト型の配列で作成する
  // MBTI_Typeの日本語はISTJ: 管理者。実用的で事実に基づいた思考の持ち主。の様に表記する
  // mbti_type
  const MBTI_Type = [
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
  const Tone = [
    { polite: '丁寧' },
    { calm: '落ち着いた' },
    { casual: 'カジュアル' },
    { energetic: '活発' },
    { confident: '自信がある' },
    { logical: '論理的' },
  ]
  // expression
  const Expression = [
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
  const Empathy = [{ high: '高い' }, { moderate: '普通' }, { low: '低い' }]

  useEffect(() => {
    setMbtiType(character.mbti_type)
    setTone(character.tone)
    setExpression(character.expression)
    setValues(character.values)
    setEmpathy(character.empathy)
    setCharacter1Welcome(character.character1_welcome)
    setCharacter2Welcome(character.character2_welcome)
  }, [character])

  // 編集するボタンを押すと各値を編集できるようにする
  const onEdit = () => {
    setIsEdit(true)
  }

  // 詳細画面においてキャラクターの情報をあらかじめ用意したオブジェクト型配列から検索する
  const searchMbtiType = (mbtiType: string) => {
    const mbti = MBTI_Type.find((type) => Object.keys(type)[0] === mbtiType)
    return mbti ? Object.values(mbti)[0] : 'データが存在しません'
  }

  const searchTone = (tone: string) => {
    const toneType = Tone.find((type) => Object.keys(type)[0] === tone)
    return toneType ? Object.values(toneType)[0] : 'データが存在しません'
  }

  const searchExpression = (expression: string) => {
    const expressionType = Expression.find((type) => Object.keys(type)[0] === expression)
    return expressionType ? Object.values(expressionType)[0] : 'データが存在しません'
  }

  const searchEmpathy = (empathy: string) => {
    const empathyType = Empathy.find((type) => Object.keys(type)[0] === empathy)
    return empathyType ? Object.values(empathyType)[0] : 'データが存在しません'
  }

  // 編集したキャラクター情報を保存する
  //
  const handleSaveCharacter = () => {
    // avatar以外の情報をeditedCharacterに格納する
    // APIからのレスポンスが帰ってくるまでisEditはfalseにしない
    void (async () => {
      try {
        const editedCharacter = {
          ...character,
          name: name,
          mbti_type: mbtiType,
          tone: tone,
          expression: expression,
          values: values,
          empathy: empathy,
          character1_welcome: character1Welcome,
          character2_welcome: character2Welcome,
        }
        const res = await editCharacter(token, character.id, editedCharacter, avatar!)
        if (res) {
          const replaceAvatarUrlCharacters = replaceAvatar(res.characters)
          if (res.character.avatar.includes('localhost')) {
            const replaceAvatarUrl = res.character.avatar.replace('localhost', 'web')
            const replaceAvatarUrlCharacter = {
              ...res.character,
              avatar: replaceAvatarUrl,
            }
            setSelectCharacter(replaceAvatarUrlCharacter)
          } else {
            setSelectCharacter(res.character)
          }
          setCharacters(replaceAvatarUrlCharacters)
        }
      } catch (error) {
        console.error('Error editing character', error)
      } finally {
        setIsEdit(false)
      }
    })()
  }

  // selectCharacterが更新された場合、各stateを更新する
  useEffect(() => {
    setName(selectCharacter.name)
    setMbtiType(selectCharacter.mbti_type)
    setTone(selectCharacter.tone)
    setExpression(selectCharacter.expression)
    setValues(selectCharacter.values)
    setEmpathy(selectCharacter.empathy)
    setCharacter1Welcome(selectCharacter.character1_welcome)
    setCharacter2Welcome(selectCharacter.character2_welcome)
  }, [selectCharacter])

  console.log('selectCharacter', selectCharacter)

  return (
    <div className='modal modal-open'>
      <div className='modal-box'>
        {/* 編集ボタンを押すと各値を編集できるようにする */}
        {/* mbti_type, tone, expression, empathyはバックエンドではenumで処理しているのでプルダウンで選択する */}
        {/* avatarはユーザーが画像ファイルをアップロードし、それを表示させるがバックエンドから得たデータ（character）ではurlを用いているためstring */}
        {/* ユーザーがアップロードするファイルは画像ファイルなのでfile形式になる。 */}
        {/* 他の項目はstringなので通常の入力フォームを用いる。挨拶に関しては長文になるのでtextareaを用いる */}
        {isEdit ? (
          <>
            <div className='modal-header'>
              <h3 className='font-bold text-lg'>キャラクター情報を編集</h3>
            </div>
            <div className='modal-body'>
              <div className='form-control'>
                <label htmlFor='name'>名前</label>
                <input
                  type='text'
                  id='name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className='form-control'>
                <label htmlFor='avatar'>アバター</label>
                <input
                  type='file'
                  id='avatar'
                  onChange={(e) => {
                    if (e.target.files) {
                      setAvatar(e.target.files[0])
                    } else {
                      setAvatar(null)
                    }
                  }}
                />
              </div>
              <div className='form-control'>
                <label htmlFor='mbti_type'>MBTIタイプ</label>
                <select
                  id='mbti_type'
                  value={mbtiType}
                  onChange={(e) => setMbtiType(e.target.value)}
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
                <select id='tone' value={tone} onChange={(e) => setTone(e.target.value)}>
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
                  value={expression}
                  onChange={(e) => setExpression(e.target.value)}
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
                  value={values}
                  onChange={(e) => setValues(e.target.value)}
                />
              </div>
              <div className='form-control'>
                <label htmlFor='empathy'>共感度</label>
                <select
                  id='empathy'
                  value={empathy}
                  onChange={(e) => setEmpathy(e.target.value)}
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
                  value={character1Welcome}
                  onChange={(e) => setCharacter1Welcome(e.target.value)}
                />
              </div>
              <div className='form-control'>
                <label htmlFor='character2_welcome'>キャラクター2の挨拶</label>
                <textarea
                  id='character2_welcome'
                  value={character2Welcome}
                  onChange={(e) => setCharacter2Welcome(e.target.value)}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            {/*selectCharacter.avatarにlocalhostが含まれる場合表示しない */}
            {selectCharacter && (
              <div className='modal-body'>
                <div className='form-control items-center border mb-1'>
                  <Image
                    src={selectCharacter.avatar}
                    alt={selectCharacter.name}
                    width={100}
                    height={100}
                    className='rounded-full'
                  />
                  <div>{selectCharacter.name}</div>
                </div>
                <div className='form-control border px-2'>
                  {/* Gridに変えます */}
                  <div className='form-control mt-1 mb-1'>
                    <p>{searchMbtiType(selectCharacter.mbti_type)}</p>
                  </div>
                  <div className='form-control mb-1'>
                    <p>口調： 【{searchTone(selectCharacter.tone)}】</p>
                  </div>
                  <div className='form-control mb-1'>
                    <p>【{searchExpression(selectCharacter.expression)}】</p>
                  </div>
                  <div className='form-control mb-1'>
                    <p>{selectCharacter.values}</p>
                  </div>
                  <div className='form-control mb-1'>
                    <p>共感性は【{searchEmpathy(selectCharacter.empathy)}】</p>
                  </div>
                  <div className='form-control mb-1'>
                    <label htmlFor='character1_welcome' className='text-sm'>
                      キャラクター1に設定した時の挨拶
                    </label>
                    <p className='border mb-1 p-1'>
                      {selectCharacter.character1_welcome}
                    </p>
                  </div>
                  <div className='form-control mb-1'>
                    <label htmlFor='character2_welcome' className='text-sm'>
                      キャラクター2に設定した時の挨拶
                    </label>
                    <p className='border mb-1 p-1'>
                      {selectCharacter.character2_welcome}
                    </p>
                  </div>
                </div>
              </div>
            )}
            {!selectCharacter && <Loading />}
          </>
        )}
        {/* 編集ボタンを押した場合、「編集する」を「保存する」に変更する */}
        {isEdit ? (
          <div className='modal-action'>
            <button className='btn' onClick={handleSaveCharacter}>
              保存する
            </button>
            <button className='btn' onClick={() => setIsEdit(false)}>
              キャンセル
            </button>
          </div>
        ) : (
          <div className='modal-action'>
            <button className='btn' onClick={onEdit}>
              編集する
            </button>
            <button className='btn' onClick={onClose}>
              閉じる
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export { CharacterDetailModal }
