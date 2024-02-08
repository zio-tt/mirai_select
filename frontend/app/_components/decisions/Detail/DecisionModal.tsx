import { BookmarkButton } from '@/app/_components/decisions/Comment/BookmarkButton'
import { CommentsDisplay } from '@/app/_components/decisions/Comment/CommentDisplay'
import { CommentInputForm } from '@/app/_components/decisions/Comment/CommentInputForm'
import { DecisionDetail } from '@/app/_components/decisions/Detail/DecisionDetail'
import { useDetailData } from '@/app/_hooks/_decisions/useDetailData'
import { Decision, Conversation } from '@/app/_types'

const DecisionModal = ({
  decision,
  conversations,
  handleCloseDetail,
}: {
  decision: Decision
  conversations: Conversation[]
  handleCloseDetail: () => void
}) => {
  const { decisionCharacters, characterResponses } = useDetailData(decision)
  // モーダルのコンテンツをクリックしたときにイベントの伝播を止める
  const handleModalContentClick = (event: React.MouseEvent) => {
    event.stopPropagation()
  }

  return (
    <>
      {decisionCharacters && characterResponses && (
        // モーダルの外側をクリックしたときにモーダルを閉じる
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
                <DecisionDetail
                  decision={decision}
                  conversations={conversations}
                  decisionCharacters={decisionCharacters}
                  characterResponses={characterResponses}
                />
              </div>
            </div>
            <div
              className='flex flex-col w-[30%] h-[80%] bg-white py-5 rounded-lg items-center ml-4'
              onClick={handleModalContentClick}
            >
              <div className='flex flex-col w-full h-full justify-between'>
                <CommentsDisplay decision={decision} />
                <BookmarkButton decision={decision} />
                <CommentInputForm decision={decision} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export { DecisionModal }
