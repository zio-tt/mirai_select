import { useState, useEffect } from 'react'

import { useHelper } from '@/app/_contexts/HelperContext'

const Steps = () => {
  const [explanatoryText, setExplanatoryText] = useState<string[]>([''])
  const { conversationCount } = useHelper()

  useEffect(() => {
    if (conversationCount === 1) {
      setExplanatoryText([
        '相談を100文字以内で入力フォームに入力して送信してください。',
        'キャラクターからの返答に対して1度だけ再相談することができます。',
        '現在のポイント数を確認したい場合は、左上のメニューボタン（三）をクリック',
        '→サイドバーの一番下に表示されます。',
      ])
    } else if (conversationCount === 2) {
      setExplanatoryText([
        'どちらか良いと思った方の意見をクリックして、',
        '相談を終了するか、続けて相談するかを左下のトグルボタンで選択してください。',
        '相談を終了する場合はタグをカンマ(,)区切りで入力し、右下の公開設定を選択して送信してください。',
      ])
    } else if (conversationCount === 3) {
      setExplanatoryText([
        'どちらか良いと思った方の意見をクリックして、',
        'グをカンマ(,)区切りで入力し、右下の公開設定を選択して送信してください。',
      ])
    } else {
      setExplanatoryText([])
    }
  }, [conversationCount])

  return (
    <>
      <div className='sticky flex flex-col'>
        <ul className='steps mb-1'>
          <li className={`step ${conversationCount >= 1 && 'step-info'}`} />
          <li className={`step ${conversationCount >= 2 && 'step-info'}`} />
          <li className={`step ${conversationCount >= 3 && 'step-info'}`} />
        </ul>
        <div className='flex text-sm text-center flex-col'>
          {explanatoryText.map((text, index) => (
            <p key={index}>{text}</p>
          ))}
        </div>
      </div>
    </>
  )
}

export { Steps }
