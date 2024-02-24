import Image from 'next/image'

import { useDecisions } from '@/app/_contexts/_featureContexts/DecisionsContext'
import { deleteComment } from '@/app/_features/fetchAPI/fetchComment'
import { useDecisionsData } from '@/app/_hooks/_decisions/useDecisionsData'
import { Decision } from '@/app/_types'

interface CommentsDisplayProps {
  decision: Decision
}

const CommentsDisplay = ({ decision }: CommentsDisplayProps) => {
  // initial state
  const { setComments } = useDecisions()
  const { currentUser, users, comments } = useDecisions()
  const { token } = useDecisionsData()
  if (!currentUser || !users || !comments) return null

  // idが大きい順に並び替え
  const decisionComments = comments
    .filter((comment) => comment.decision_id === decision.id)
    .sort((a, b) => b.id - a.id)

  const handleDeleteComment = (id: number) => {
    if (!id) return
    ;async () => {
      if (!token) return
      try {
        const response = await deleteComment(token, id)
        if (response) {
          setComments(response)
        } else {
          console.log('コメントの削除に失敗しました')
        }
      } catch (error) {
        console.error(error)
      }
    }
  }

  return (
    <div className='flex flex-col flex-grow w-full border overflow-auto h-[60%]'>
      {decisionComments.map((comment, index) => {
        const user = users?.find((user) => user.id === comment.user_id)
        return (
          <div key={index} className='flex flex-row border-b p-2 items-center'>
            <Image
              alt={user!.name}
              src={user!.avatar || '/images/logo.png'}
              width={30}
              height={30}
              className='flex rounded-full'
            />
            <div className='overflow-y-auto'>
              <div className='p-4  border-gray-200'>
                <span>{comment.content}</span>
              </div>
            </div>
            {currentUser.id === comment.user_id && (
              <Image
                alt='削除'
                src='/images/delete_button.png'
                width={20}
                height={20}
                onClick={() => handleDeleteComment(comment.id)}
                className='flex ml-2 opacity-20'
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export { CommentsDisplay }
