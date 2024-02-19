/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react'

import { useDecisions } from '@/app/_contexts/DecisionsContext'

interface CreateCharacterProps {
  handleCloseDetail: () => void
}

// キャラクターを作成する画面のコンポーネント
const CreateCharacter = ({ handleCloseDetail }: CreateCharacterProps) => {
  // 入力フォームで使用するstate
  const [name, setName] = useState<string>('')
  const [mbtiType, setMbtiType] = useState<number>(0)
  const [tone, setTone] = useState<number>(0)
  const [firstPerson, setFirstPerson] = useState<string>('')
  const [secondPerson, setSecondPerson] = useState<string>('')
  const [expression, setExpression] = useState<number>(0)
  const [values, setValues] = useState<string>('')
  const [empathy, setEmpathy] = useState<number>(0)
  const [character1Welcome, setCharacter1Welcome] = useState<string>('')
  const [character2Welcome, setCharacter2Welcome] = useState<string>('')
  const { setIsModalOpen } = useDecisions()

  const handleModalContentClick = (event: React.MouseEvent) => {
    event.stopPropagation()
  }

  return (
    <>
      <div className='fixed inset-0 flex items-center justify-center z-40'>
        <div className='fixed inset-0 bg-black bg-opacity-50 z-60' />
        {/* ここをクリックしても何も起きないようにstopPropagationを呼び出す */}
        <div
          className='fixed flex w-full h-full items-center justify-center z-50'
          onClick={handleCloseDetail}
        >
          <div
            className='flex flex-col w-[50%] h-[80%] bg-white p-5 rounded-lg items-center mr-2'
            onClick={handleModalContentClick}
          >
            <div className='flex h-full w-full justify-center items-center'>
              <form>
                <div>
                  <label htmlFor='name'>名前</label>
                  <input
                    type='text'
                    id='name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor='mbtiType'>性格(MBTI)</label>
                  <select
                    id='mbtiType'
                    value={mbtiType}
                    onChange={(e) => setMbtiType(Number(e.target.value))}
                  >
                    <option value={0}>ISTJ</option>
                    <option value={1}>ISFJ</option>
                    <option value={2}>INFJ</option>
                    <option value={3}>INTJ</option>
                    <option value={4}>ISTP</option>
                    <option value={5}>ISFP</option>
                    <option value={6}>INFP</option>
                    <option value={7}>INTP</option>
                    <option value={8}>ESTP</option>
                    <option value={9}>ESFP</option>
                    <option value={10}>ENFP</option>
                    <option value={11}>ENTP</option>
                    <option value={12}>ESTJ</option>
                    <option value={13}>ESFJ</option>
                    <option value={14}>ENFJ</option>
                    <option value={15}>ENTJ</option>
                  </select>
                </div>
                <div>
                  <label htmlFor='tone'>口調</label>
                  <select
                    id='tone'
                    value={tone}
                    onChange={(e) => setTone(Number(e.target.value))}
                  >
                    <option value={0}>丁寧</option>
                    <option value={1}>落ち着いた</option>
                    <option value={2}>カジュアル</option>
                    <option value={3}>活発</option>
                    <option value={4}>自信がある</option>
                    <option value={5}>論理的</option>
                  </select>
                </div>
                <div>
                  <label htmlFor='firstPerson'>一人称</label>
                  <input
                    type='text'
                    id='firstPerson'
                    value={firstPerson}
                    onChange={(e) => setFirstPerson(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor='secondPerson'>二人称</label>
                  <input
                    type='text'
                    id='secondPerson'
                    value={secondPerson}
                    onChange={(e) => setSecondPerson(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor='expression'>感情表現</label>
                  <select
                    id='expression'
                    value={expression}
                    onChange={(e) => setExpression(Number(e.target.value))}
                  >
                    <option value={0}>ユーモア</option>
                    <option value={1}>皮肉</option>
                    <option value={2}>情熱的</option>
                    <option value={3}>創造的</option>
                    <option value={4}>積極的</option>
                    <option value={5}>消極的</option>
                    <option value={6}>感情的</option>
                    <option value={7}>真面目</option>
                    <option value={8}>不真面目</option>
                    <option value={9}>ネガティブ</option>
                    <option value={10}>ポジティブ</option>
                    <option value={11}>優しい</option>
                    <option value={12}>厳しい</option>
                  </select>
                </div>
                <div>
                  <label htmlFor='values'>価値観</label>
                  <input
                    type='text'
                    id='values'
                    value={values}
                    onChange={(e) => setValues(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor='empathy'>共感</label>
                  <select
                    id='empathy'
                    value={empathy}
                    onChange={(e) => setEmpathy(Number(e.target.value))}
                  >
                    <option value={0}>高い</option>
                    <option value={1}>普通</option>
                    <option value={2}>低い</option>
                  </select>
                </div>
                <div>
                  <label htmlFor='character1Welcome'>キャラクター1の説明文</label>
                  <input
                    type='text'
                    id='character1Welcome'
                    value={character1Welcome}
                    onChange={(e) => setCharacter1Welcome(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor='character2Welcome'>キャラクター2の説明文</label>
                  <input
                    type='text'
                    id='character2Welcome'
                    value={character2Welcome}
                    onChange={(e) => setCharacter2Welcome(e.target.value)}
                  />
                </div>
                <button type='submit'>作成</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export { CreateCharacter }
