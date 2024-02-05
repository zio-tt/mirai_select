import { HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as SolidHeartIcon } from '@heroicons/react/24/solid'
import { useEffect, useState } from 'react'

import { useDecisions } from '@/app/_contexts/DecisionsContext'
import { createBookmark, deleteBookmark } from '@/app/_features/fetchAPI'
import { useDecisionsData } from '@/app/_hooks/_decisions/useDecisionsData'
import { Decision } from '@/app/_types'

interface BookmarksButtonProps {
  decision: Decision
}

const BookmarkButton = ({ decision }: BookmarksButtonProps) => {
  const { token } = useDecisionsData()
  const { currentUser } = useDecisions()
  const { bookmarks, setBookmarks } = useDecisions()
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false)
  const [isOtherUsers, setIsOtherUsers] = useState<boolean>(false)

  useEffect(() => {
    // selectedDecision.user_idがcurrentUser.idと一致するか
    if (currentUser && decision) {
      setIsOtherUsers(decision.user_id !== currentUser.id)
    }
    if (currentUser && bookmarks) {
      // bookmarksの中にselectedDecision.idとcurrentUser.idの組み合わせと合致するものがあるか
      const bookmark = bookmarks.some(
        (bookmark) =>
          bookmark.decision_id === decision.id && bookmark.user_id === currentUser.id,
      )
      setIsBookmarked(bookmark)
    }
  }, [bookmarks, currentUser, decision])

  const handleBookmark = () => {
    setIsBookmarked(true)
    ;async () => {
      if (!token) return
      try {
        const response = await createBookmark(token, decision.id)
        if (response) {
          setBookmarks(response)
        }
      } catch (error) {
        console.error(error)
      }
    }
  }

  const handleNotBookmark = () => {
    setIsBookmarked(false)
    ;async () => {
      if (!token) return
      try {
        const response = await deleteBookmark(token, decision.id)
        if (response) {
          setBookmarks(response)
        }
      } catch (error) {
        console.error(error)
      }
    }
  }

  return (
    <div className='flex justify-between items-center p-4 border-t border-gray-200'>
      <div className='flex space-x-4'>
        {isOtherUsers && isBookmarked && (
          <div onClick={handleNotBookmark}>
            <SolidHeartIcon className='w-6 h-6 cursor-pointer text-red-500' />
          </div>
        )}
        {isOtherUsers && !isBookmarked && (
          <div onClick={handleBookmark}>
            <HeartIcon className='w-6 h-6 cursor-pointer text-red-500' />
          </div>
        )}
      </div>
    </div>
  )
}

export { BookmarkButton }
