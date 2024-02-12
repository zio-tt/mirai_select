import { useEffect, useRef } from 'react'

import { useHelper } from '@/app/_contexts/HelperContext'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useAutoResizeTextArea = (initialValue: string = '') => {
  const { queryText, setQueryText } = useHelper()
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const textArea = textAreaRef.current
    if (textArea) {
      textArea.style.height = 'auto' // テキストエリアの高さをリセット
      textArea.style.height = `${textArea.scrollHeight}px` // 新しい高さを設定
    }
  }, [queryText])

  return {
    queryText,
    setQueryText,
    textAreaRef,
  }
}
