/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { TrashIcon } from '@heroicons/react/24/solid'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'

import { DecisionCard } from '@/app/_components/decisions/DecisionCard'
import { DecisionModal } from '@/app/_components/decisions/Detail/DecisionModal'
import { Pagination } from '@/app/_components/decisions/Pagination/Pagination'
import { Loading } from '@/app/_components/layouts/loading/layout'
import { useDecisions } from '@/app/_contexts/DecisionsContext'
import { useDrawer } from '@/app/_contexts/DrawerContext'
import { deleteDecision } from '@/app/_features/fetchAPI'
import { useDecisionsData } from '@/app/_hooks/_decisions/useDecisionsData'
import { usePagination } from '@/app/_hooks/_decisions/usePagination'
import { useSearchDecisions } from '@/app/_hooks/_decisions/useSearchDecisions'
import { Decision } from '@/app/_types'

import { SortDecisions } from './SortDecisions'

interface DecisionIndexProps {
  decisions: Decision[]
  setDecisions: (decisions: Decision[]) => void
  getDecisionsData: (condition: string) => Promise<void>
  condition?: string
}

const DecisionIndex = ({
  decisions,
  setDecisions,
  getDecisionsData,
  condition,
}: DecisionIndexProps) => {
  const { isLoading, setIsLoading } = useDecisions()

  const { token } = useDecisionsData()
  const isRoute = usePathname()

  const { conversations, comments, bookmarks, decisionTags, tags } = useDecisions()

  const [selectedDecision, setSelectedDecision] = useState<Decision | undefined>(
    undefined,
  ) // 詳細表示するDecision

  // 検索結果,詳細表示用のstate
  const [filteredDecisions, setFilteredDecisions] = useState<Decision[]>([])

  // ドロワーの状態管理
  const { isDrawerClick, setIsDrawerClick } = useDrawer()

  // 検索用State
  const [searchQuery, setSearchQuery] = useState('') // 相談文の検索キーワード
  const [selectedTag, setSelectedTag] = useState('') // 選択されたタグ
  const [sortOrder, setSortOrder] = useState('date_new') // 並べ替えの順序

  // ページネーション
  const [itemsPerPage] = useState(10) // 1ページに表示するDecisionの数
  // カスタムフックを使用して、filteredDecision, currentPage, itemsPerPageが更新された時、
  // 1. 現在のページに表示するDecisionを抜き出す
  // 2. 必要なページ番号を再計算する
  const { currentPage, setCurrentPage, currentItems, pageNumbers } = usePagination({
    initialData: filteredDecisions,
    initialPage: 1,
    itemsPerPage: itemsPerPage,
  })
  // ページネーションに関係するstate
  // カスタムフックで提供されるsetCurrentPageを使用して、
  // ページネーションの各ボタンがクリックされた時に、currentPageを更新する
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)
  const paginateFirst = () => setCurrentPage(1)
  const paginateLast = () => setCurrentPage(pageNumbers.length)

  // オートコンプリート
  const [isTagInputFocused, setIsTagInputFocused] = useState(false)
  const autoCompleteTagsRef = useRef<HTMLDivElement>(null)
  const blankTag = { id: 0, name: '' }

  const { isModalOpen, setIsModalOpen } = useDecisions()

  // DrawerかHeaderのメニュークリック時、あるいはページ更新時に全ての状態をリセットする
  useEffect(() => {
    setIsModalOpen(false)
    setFilteredDecisions([])
    setSearchQuery('')
    setSelectedTag('')
    setSortOrder('date_new')
    setCurrentPage(1)
    setIsDrawerClick(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 下記タイミングでAPIからDecisionsを取得し、stateを更新する
  // 1. ページが更新された時
  // 2. ドロワーがクリックされた時
  // 3. モーダルを閉じた時
  // 4. 検索キーワードが変更された時
  // 5. 選択されたタグが変更された時
  // 6. 並べ替えの順序が変更された時
  useEffect(() => {
    void (async () => {
      try {
        if (isRoute === '/decisions') {
          await getDecisionsData('public')
        } else if (isRoute === '/mypage/favorite') {
          await getDecisionsData('favorite')
        } else if (isRoute === '/mypage/private') {
          await getDecisionsData('private')
        }
      } catch (error) {
        console.error('Error fetching decisions:', error)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDrawerClick, isRoute ?? ''])

  const searchResults = useSearchDecisions(
    decisions,
    conversations,
    tags,
    decisionTags,
    searchQuery,
    selectedTag,
    sortOrder,
    filteredDecisions,
  )

  // 次に、useEffect内でその結果を使用します。
  useEffect(() => {
    if (!searchResults) return
    setFilteredDecisions(searchResults)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decisions, searchQuery, selectedTag, sortOrder])

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault()
    SortDecisions(
      e.target.value,
      setSortOrder,
      filteredDecisions,
      setFilteredDecisions,
      comments,
      bookmarks,
    )
  }

  const handleDecisionClick = (decision: Decision) => {
    setSelectedDecision(decision)
    setIsModalOpen(true)
  }

  const handleCloseDetail = () => {
    setSelectedDecision(undefined)
    setIsModalOpen(false)
  }

  const handleSearchWithTag = (tagToSearch: string) => {
    let filtered = decisions

    if (tagToSearch) {
      filtered = filtered.filter((decision) => {
        const filteredDecisionTags = decisionTags.filter(
          (decisionTag) => decisionTag.decision_id === decision.id,
        )
        return filteredDecisionTags.some((decision_tag) => {
          const tag = tags.find((tag) => tag.id === decision_tag.tag_id)
          return tag && tag.name === tagToSearch
        })
      })
    }

    setFilteredDecisions(filtered)
  }

  const handleSelectTag = (tagName: string) => {
    setSelectedTag(tagName)
    setIsTagInputFocused(false)
    handleSearchWithTag(tagName)
  }

  const handleBlurSelectTag = (e: React.FocusEvent<HTMLInputElement>) => {
    // 少し遅延を入れて、子要素のクリックイベントが先に処理されるようにする
    setTimeout(() => {
      // refをチェックして、フォーカスが外れた要素がオートコンプリートリスト内でないことを確認
      if (
        autoCompleteTagsRef.current &&
        !autoCompleteTagsRef.current.contains(e.relatedTarget as Node)
      ) {
        setIsTagInputFocused(false)
      }
    }, 200) // 100ミリ秒の遅延
  }

  const handleDeleteDecision = (decisionId: number) => async () => {
    if (confirm('本当に削除しますか？')) {
      setIsLoading(true)
      const response = await deleteDecision({ token: token, decisionId: decisionId })
      setDecisions(response)
      setFilteredDecisions(response)
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* 検索フォーム */}
      <div className='w-[70vw] mt-[2vh] mb-[3vh] flex relative'>
        <input
          id='searchText'
          type='text'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder='相談文を検索...'
          className='min-w-[20%] border p-2 mr-2'
        />
        <div className='flex flex-col relative'>
          <input
            id='searchTag'
            type='text'
            value={selectedTag}
            onChange={(e) => {
              setSelectedTag(e.target.value)
              handleSearchWithTag(e.target.value)
            }}
            onFocus={() => setIsTagInputFocused(true)}
            onBlur={(e) => handleBlurSelectTag(e)}
            placeholder='タグを検索...'
            className='border p-2 mr-2'
          />
          {/* オートコンプリートリスト */}
          {isTagInputFocused && (
            <div
              ref={autoCompleteTagsRef}
              className='absolute z-10 bg-white border rounded max-h-40 overflow-auto'
              style={{
                top: '100%', // 入力フォームの直下
                left: '0',
                right: '0',
                // width: '100%' // 必要に応じて追加
              }}
            >
              {/* タグのリスト */}
              {[blankTag, ...tags].map((tag) => (
                <div
                  key={tag.id}
                  onClick={() => handleSelectTag(tag.name)}
                  className='p-2 hover:bg-gray-100 text-black'
                >
                  {tag.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <select onChange={handleSortChange} id='selectSort' className='min-w-[20%] ml-2'>
          <option value='date_new'>新しい順</option>
          <option value='date_old'>古い順</option>
          <option value='comments'>コメント数順</option>
          <option value='bookmarks'>ブックマーク数順</option>
        </select>
      </div>

      {!currentItems && <div></div>}
      {isLoading && (
        <div className='w-full min-h-screen'>
          <Loading />
        </div>
      )}
      {!isLoading && currentItems && (
        <>
          <div className='w-[70vw] mb-[5vh] flex justify-start flex-col'>
            {currentItems.map((decision) => {
              // DecisionCardに渡すpropsを設定
              // targetTags: (decision.id == decisionTagsの各要素decisionTag.decision_id)
              //             の条件を満たすdecisionTagsの各要素のtag_idに対応するtagsの各要素
              const targetDecisionTags = decisionTags.filter(
                (decisionTag) => decisionTag.decision_id === decision.id,
              )
              const targetTags = tags?.filter((tag) =>
                targetDecisionTags.some((decisionTag) => decisionTag.tag_id === tag.id),
              )

              const decisionComments =
                comments && comments.length > 0
                  ? comments.filter((comment) => comment.decision_id === decision.id)
                  : []
              const decisionBookmarks =
                bookmarks && bookmarks.length > 0
                  ? bookmarks.filter((bookmark) => bookmark.decision_id === decision.id)
                  : []
              const decisionConversations =
                conversations && conversations.length > 0
                  ? conversations.filter(
                      (conversation) => conversation.decision_id === decision.id,
                    )
                  : []
              const sortedConversations = decisionConversations.sort(
                (a, b) =>
                  new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
              )

              if (!sortedConversations[0]) return
              return (
                <div key={decision.id} className='flex flex-row items-center'>
                  <div
                    className='flex mb-4 mr-6 w-[80%] shadow-lg rounded-lg'
                    onClick={() => handleDecisionClick(decision)}
                  >
                    <DecisionCard
                      query_text={sortedConversations[0].query_text}
                      comments={decisionComments}
                      bookmarks={decisionBookmarks}
                      decision_tags={targetTags}
                    />
                  </div>
                  {isRoute === '/mypage/private' && (
                    <TrashIcon
                      onClick={() => handleDeleteDecision(decision.id)}
                      className='w-[3vw] flex text-black'
                    />
                  )}
                </div>
              )
            })}
          </div>

          <Pagination
            postsPerPage={itemsPerPage}
            totalPosts={filteredDecisions ? filteredDecisions.length : 0}
            paginate={paginate}
            currentPage={currentPage}
            paginateFirst={paginateFirst}
            paginateLast={paginateLast}
          />

          {selectedDecision && (
            <DecisionModal
              decision={selectedDecision}
              conversations={
                conversations
                  ? conversations.filter(
                      (convo) => convo.decision_id === selectedDecision.id,
                    )
                  : []
              }
              handleCloseDetail={handleCloseDetail}
              firstQuery={
                conversations && conversations.length > 0 && selectedDecision
                  ? conversations
                      .filter(
                        (conversation) =>
                          conversation.decision_id === selectedDecision.id,
                      )
                      .sort(
                        (a, b) =>
                          new Date(a.created_at).getTime() -
                          new Date(b.created_at).getTime(),
                      )[0].query_text
                  : ``
              }
            />
          )}
        </>
      )}
    </>
  )
}

export { DecisionIndex }
