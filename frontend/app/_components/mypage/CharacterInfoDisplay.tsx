/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unsafe-return */
// components/CharacterDetailModal.tsx
import Image from 'next/image'

import { useCharacterList } from '@/app/_contexts/CharacterListContext'

import { Loading } from '../layouts/loading/layout'

interface CharacterInfoDisplayProps {
  onClose: () => void
  onEdit: () => void
  MBTI_Type: { [key: string]: string }[]
  Tone: { [key: string]: string }[]
  Expression: { [key: string]: string }[]
  Empathy: { [key: string]: string }[]
}

const CharacterInfoDisplay = ({
  onClose,
  onEdit,
  MBTI_Type,
  Tone,
  Expression,
  Empathy,
}: CharacterInfoDisplayProps) => {
  const { selectCharacter } = useCharacterList()

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

  return (
    <>
      <div className='modal modal-open'>
        <div className='modal-box'>
          {/*character.avatarにlocalhostが含まれる場合表示しない */}
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
                  <p>一人称は【{selectCharacter.first_person}】</p>
                </div>
                <div className='form-control mb-1'>
                  <p>二人称は【{selectCharacter.second_person}】</p>
                </div>
                <div className='form-control mb-1'>
                  <label htmlFor='character1_welcome' className='text-sm'>
                    キャラクター1に設定した時の挨拶
                  </label>
                  <p className='border mb-1 p-1'>{selectCharacter.character1_welcome}</p>
                </div>
                <div className='form-control mb-1'>
                  <label htmlFor='character2_welcome' className='text-sm'>
                    キャラクター2に設定した時の挨拶
                  </label>
                  <p className='border mb-1 p-1'>{selectCharacter.character2_welcome}</p>
                </div>
              </div>
            </div>
          )}
          {!selectCharacter && <Loading />}
          <div className='modal-action'>
            <button className='btn' onClick={onEdit}>
              編集する
            </button>
            <button className='btn' onClick={onClose}>
              閉じる
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export { CharacterInfoDisplay }
