import Image from 'next/image'

import { User, Comment } from '@/app/_types'

interface CommentsDisplayProps {
  users: User[]
  decisionComments: Comment[]
}

const GuestCommentsDisplay = ({ users, decisionComments }: CommentsDisplayProps) => {
  // idが大きい順に並び替え
  const sortedComments = decisionComments.sort((a, b) => b.id - a.id)

  return (
    <div className='flex flex-col flex-grow w-full border overflow-auto h-[60%]'>
      {sortedComments.map((comment, index) => {
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
          </div>
        )
      })}
    </div>
  )
}

export { GuestCommentsDisplay }
