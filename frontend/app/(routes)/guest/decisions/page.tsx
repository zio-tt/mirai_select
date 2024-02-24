'use client'

import axios from 'axios'
import CryptoJS from 'crypto-js'
import { useState, useEffect, useRef } from 'react'

import { DecisionCard } from '@/app/_components/decisions/DecisionCard'
import { Pagination } from '@/app/_components/decisions/Pagination/Pagination'
import { SortDecisions } from '@/app/_components/decisions/SortDecisions'
import { GuestDecisionModal } from '@/app/_components/guest/GuestDecisionModal'
import { Loading } from '@/app/_components/layouts/loading/layout'
import { useDecisions } from '@/app/_contexts/_featureContexts/DecisionsContext'
import { usePagination } from '@/app/_hooks/_decisions/usePagination'
import { useSearchDecisions } from '@/app/_hooks/_decisions/useSearchDecisions'
import { Decision, Bookmark, Comment, Conversation, DecisionTag, Tag } from '@/app/_types'

export default function MyPageDecisions() {
  const [decisions, setDecisions] = useState<Decision[]>([])
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [decisionTags, setDecisionTags] = useState<DecisionTag[]>([])
  const [tags, setTags] = useState<Tag[]>([])

  const { isLoading, setIsLoading } = useDecisions()

  const [selectedDecision, setSelectedDecision] = useState<Decision | undefined>(
    undefined,
  ) // 詳細表示するDecision

  // 検索結果,詳細表示用のstate
  const [filteredDecisions, setFilteredDecisions] = useState<Decision[]>([])

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isTagInputFocused, setIsTagInputFocused] = useState(false)
  const autoCompleteTagsRef = useRef<HTMLDivElement>(null)
  const blankTag = { id: 0, name: '' }

  const { setIsModalOpen } = useDecisions()

  const encryptToken = (token: string) => {
    const secretKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY
    const key = CryptoJS.enc.Utf8.parse(secretKey!)
    const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(token), key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    })
    return encrypted.toString()
  }

  interface ResponseData {
    bookmarks: Bookmark[]
    comments: Comment[]
    conversations: Conversation[]
    decisions: Decision[]
    decision_tags: DecisionTag[]
    tags: Tag[]
  }

  const fetchApiData = async (contentType: string) => {
    try {
      const token = process.env.NEXT_PUBLIC_ENCRYPTION_TOKEN
      const encryptedToken = encryptToken(token!)
      const url = `${process.env.NEXT_PUBLIC_API_URL}/guest/${contentType}`
      const response = await axios.get<ResponseData>(url, {
        headers: {
          Authorization: `Bearer ${encryptedToken}`,
          'X-Requested-With': 'XMLHttpRequest',
        },
        withCredentials: true,
      })
      // Update the appropriate state based on contentType
      switch (contentType) {
        case 'bookmarks':
          setBookmarks(response.data.bookmarks)
          break
        case 'comments':
          setComments(response.data.comments)
          break
        case 'conversations':
          setConversations(response.data.conversations)
          break
        case 'decisions':
          setDecisions(response.data.decisions)
          break
        case 'decision_tags':
          setDecisionTags(response.data.decision_tags)
          break
        case 'tags':
          setTags(response.data.tags)
          break
        default:
          console.error('Invalid contentType')
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    setIsModalOpen(false)
    setSearchQuery('')
    setSelectedTag('')
    setSortOrder('date_new')
    setCurrentPage(1)

    void (async () => {
      setIsLoading(true)
      try {
        await fetchApiData('bookmarks')
        await fetchApiData('comments')
        await fetchApiData('conversations')
        await fetchApiData('decisions')
        await fetchApiData('decision_tags')
        await fetchApiData('tags')
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    })()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
    setTimeout(() => {
      if (
        autoCompleteTagsRef.current &&
        !autoCompleteTagsRef.current.contains(e.relatedTarget as Node)
      ) {
        setIsTagInputFocused(false)
      }
    }, 200)
  }

  return (
    <>
      <div className='flex flex-col items-center justify-center w-screen min-h-screen pt-[3rem]'>
        {/* 検索フォーム */}
        <div className='w-[90vw] mt-[2vh] mb-[3vh] flex relative justify-center'>
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

          <select
            onChange={handleSortChange}
            id='selectSort'
            className='min-w-[20%] ml-2'
          >
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
            <div className='w-[90vw] mb-[5vh] flex justify-center flex-col'>
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
                      className='flex mb-4 mr-6 w-[100%] shadow-lg rounded-lg'
                      onClick={() => handleDecisionClick(decision)}
                    >
                      <DecisionCard
                        query_text={sortedConversations[0].query_text}
                        comments={decisionComments}
                        bookmarks={decisionBookmarks}
                        decision_tags={targetTags}
                      />
                    </div>
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
              <GuestDecisionModal
                decision={selectedDecision}
                conversations={
                  conversations
                    ? conversations.filter(
                        (convo) => convo.decision_id === selectedDecision.id,
                      )
                    : []
                }
                decisionComments={
                  comments
                    ? comments.filter(
                        (comment) => comment.decision_id === selectedDecision.id,
                      )
                    : []
                }
                handleCloseDetail={handleCloseDetail}
              />
            )}
          </>
        )}
      </div>
    </>
  )
}
