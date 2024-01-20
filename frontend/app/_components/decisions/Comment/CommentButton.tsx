import { HeartIcon, ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/outline"
import { HeartIcon as SolidHeartIcon } from "@heroicons/react/24/solid"
import { useDecisions } from "@/app/_contexts/DecisionsContext";
import { useEffect, useState } from "react";
import { createBookmark, deleteBookmark } from "@/app/_features/fetchAPI";
import { useDecisionsData } from "@/app/_hooks/_decisions/useDecisionsData";

const CommentButton = () => {
  const {token} = useDecisionsData();
  const { bookmarks, setBookmarks }   = useDecisions();
  const { currentUser } = useDecisions();
  const { selectedDecision } = useDecisions();
  const [ isBookmarked, setIsBookmarked ] = useState<boolean>(false);
  const [ isOtherUsers, setIsOtherUsers ] = useState<boolean>(false);

  useEffect(() => {
    // selectedDecision.user_idがcurrentUser.idと一致するか
    if (currentUser && selectedDecision) {
      setIsOtherUsers(selectedDecision.user_id !== currentUser.id);
    }
    if (currentUser && bookmarks) {
      // bookmarksの中にselectedDecision.idとcurrentUser.idの組み合わせと合致するものがあるか
      const bookmark = bookmarks.some(bookmark => bookmark.decision_id === selectedDecision!.id && bookmark.user_id === currentUser.id);
      setIsBookmarked(bookmark);
    }
  }, []);

  const createBookmarkData = async (id: number) => {
    if (token) {
      const data = await createBookmark(token, id);
      setBookmarks(data);
    }
  }

  const deleteBookmarkData = async (id: number) => {
    if (token) {
      const data = await deleteBookmark(token, id);
      setBookmarks(data);
    }
  }

  const handleBookmark = () => {
    setIsBookmarked(true);
    createBookmarkData(selectedDecision!.id);
  }

  const handleNotBookmark = () => {
    setIsBookmarked(false);
    deleteBookmarkData(selectedDecision!.id);
  }

  return (
    <div className="flex justify-between items-center p-4 border-t border-gray-200">
      <div className="flex space-x-4">
        { isOtherUsers && isBookmarked  && (
          <div onClick={handleNotBookmark}>
            <SolidHeartIcon className="w-6 h-6 cursor-pointer text-red-500" />
          </div>
        )}
        { isOtherUsers && !isBookmarked && (
          <div onClick={handleBookmark}>
            <HeartIcon className="w-6 h-6 cursor-pointer text-red-500" />
          </div>
        )}
      </div>
    </div>
  )
}

export { CommentButton }