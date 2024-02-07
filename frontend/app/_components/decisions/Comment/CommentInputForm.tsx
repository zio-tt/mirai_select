import { useState } from 'react'

import { useDecisions } from '@/app/_contexts/DecisionsContext'
import { createComment } from '@/app/_features/fetchAPI/fetchComment'
import { useDecisionsData } from '@/app/_hooks/_decisions/useDecisionsData'
import { Decision } from '@/app/_types'

interface CommentsInputFormProps {
  decision: Decision
}

const CommentInputForm = ({ decision }: CommentsInputFormProps) => {
  const [comment, setComment] = useState<string>('')
  const { setComments } = useDecisions()
  const { token } = useDecisionsData()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (comment.length > 50) return

    // 無名非同期関数を即時実行し、その呼び出しをvoidでマーク
    void (async () => {
      if (!token) return
      try {
        const response = await createComment(token, comment, decision.id)
        if (response) {
          setComments(response)
        } else {
          console.log('コメントの投稿に失敗しました')
        }
      } catch (error) {
        console.log(error)
      } finally {
        setComment('')
      }
    })()
  }

  return (
    <form onSubmit={handleSubmit} className='flex items-center p-4'>
      <input
        type='text'
        className='flex-1 p-2 border border-gray-300 rounded-md'
        placeholder='Add a comment...'
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button
        type='submit'
        className='ml-4 text-blue-500 font-semibold'
        disabled={!comment.trim()}
      >
        Post
      </button>
    </form>
  )
}

export { CommentInputForm }
