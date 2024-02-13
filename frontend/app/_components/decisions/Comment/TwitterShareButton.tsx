import Link from 'next/link'
import { useEffect } from 'react'

import { Character } from '@/app/_types'

interface TwitterShareButtonProps {
  queryText: string
  characters: Character[]
}

const TwitterShareButton = ({ queryText, characters }: TwitterShareButtonProps) => {
  useEffect(() => {
    // Twitterのスクリプトを動的にロード
    const script = document.createElement('script')
    script.src = 'https://platform.twitter.com/widgets.js'
    script.charset = 'utf-8'
    script.async = true
    document.body.appendChild(script)

    // コンポーネントのアンマウント時にスクリプトを削除することで、リソースをクリーンアップ
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <Link
      href='https://twitter.com/share?ref_src=twsrc%5Etfw'
      data-text={`「${queryText}」に「${characters[0].name}」と「${characters[1].name}」が答えたよ！`}
      data-url='https://www.mirai-select.net/'
      className='twitter-share-button'
      data-show-count='false'
    >
      Tweet
    </Link>
  )
}

export { TwitterShareButton }
