/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unsafe-return */
// components/CharacterDetailModal.tsx
import Image from 'next/image'

import { useCharacterList } from '@/app/_contexts/_featureContexts/CharacterListContext'

import { Loading } from '../../../layouts/loading/layout'

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
  const { customCharactersList } = useCharacterList()

  const myCharacterIds = customCharactersList
    .filter((character) => character.role == 'user')
    .map((character) => character.character_id)
  if (!selectCharacter) return <Loading />
  const isMyCharacter = myCharacterIds.includes(selectCharacter.id)

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
              <div className='flex flex-col gap-4 w-full'>
                <div className='flex gap-4 items-center'>
                  <div className='form-control rounded-full border'>
                    <Image
                      src={selectCharacter.avatar}
                      alt={selectCharacter.name}
                      width={75}
                      height={75}
                      className='rounded-full'
                    />
                  </div>
                  <div className='skeleton flex h-16 w-full items-center justify-center border rounded-se-lg'>
                    <div className='flex text-xl'>{selectCharacter.name}</div>
                  </div>
                </div>
                <div className='skeleton w-full'>
                  <table className='table-fixed border-separate border'>
                    <thead>
                      <tr>
                        <th className='w-[30%] border'>属性</th>
                        <th className='w-[65%] border'>値</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className='border text-center'>MBTI（性格）</td>
                        <td className='border'>
                          {searchMbtiType(selectCharacter.mbti_type)}
                        </td>
                      </tr>
                      <tr>
                        <td className='border text-center'>口調</td>
                        <td className='border'>{searchTone(selectCharacter.tone)}</td>
                      </tr>
                      <tr>
                        <td className='border text-center'>表情</td>
                        <td className='border'>
                          {searchExpression(selectCharacter.expression)}
                        </td>
                      </tr>
                      <tr>
                        <td className='border text-center'>価値観</td>
                        <td className='border'>{selectCharacter.values}</td>
                      </tr>
                      <tr>
                        <td className='border text-center'>共感性</td>
                        <td className='border'>
                          {searchEmpathy(selectCharacter.empathy)}
                        </td>
                      </tr>
                      <tr>
                        <td className='border text-center'>一人称</td>
                        <td className='border'>{selectCharacter.first_person}</td>
                      </tr>
                      <tr>
                        <td className='border text-center'>二人称</td>
                        <td className='border'>{selectCharacter.second_person}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className='form-control border px-2'>
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
            {isMyCharacter && (
              <button className='btn' onClick={onEdit}>
                編集する
              </button>
            )}
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
