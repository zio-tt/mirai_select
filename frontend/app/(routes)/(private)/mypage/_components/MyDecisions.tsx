'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { DecisionCard } from '@/app/_components/decisions/DecisionCard';
import { DecisionModal } from '@/app/_components/decisions/DecisionModal';
import { Bookmark, CharacterResponse,
         Comment, Conversation, Decision, Tag } from '@/app/_types';
import { Loading } from '@/app/_components/layouts/loading/layout';
import { Pagination } from '@/app/_components/layouts/pagination/pagination';
import { useDecisions } from '@/app/_contexts/DecisionsContext';
import { useMyDecisionsData } from '@/app/_hooks/_decisions/useMyDecisionsData';
import { useFavoriteDecisionsData } from '@/app/_hooks/_decisions/useFavoriteDecisionsData';
import { usePathname } from 'next/navigation';
import { useDrawer } from '@/app/_contexts/DrawerContext';

interface MappedDecision extends Decision {
  decision_tags?: Tag[];
  comments?:      Comment[];
  bookmarks?:     Bookmark[];
}

export default function MyDecisions() {
  // initial state
  const { selectedDecision, setSelectedDecision } = useDecisions();
  const { token, setToken } = useMyDecisionsData();

  const { currentUser,
          users,
          decisions,
          conversations,
          comments,
          bookmarks,
          decisionTags,
          tags } = useMyDecisionsData();

  const { fetchDecisionsData } = useMyDecisionsData();

  const [isLoading, setIsLoading] = useState(false);

  const { data: session } = useSession();

  // 検索結果,詳細表示用のstate
  const [filteredDecisions, setFilteredDecisions] = useState<Decision[]>([]);

  // ドロワーの状態管理
  const { isDrawerClick, setIsDrawerClick } = useDrawer();

  // 検索用State
  const [searchQuery, setSearchQuery] = useState(''); // 相談文の検索キーワード
  const [selectedTag, setSelectedTag] = useState(''); // 選択されたタグ
  const [sortOrder, setSortOrder] = useState('date_new'); // 並べ替えの順序

  // ページネーション
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // 1ページあたりのアイテム数

  // オートコンプリート
  const [isTagInputFocused, setIsTagInputFocused] = useState(false);
  const autoCompleteTagsRef = useRef<HTMLDivElement>(null);
  const blankTag = { id: 0, name: '' }

  useEffect(() => {
    if(session) {
      setToken(session?.appAccessToken!);
    }
  }, [session]);

  useEffect(() => {
    if(token){
      fetchDecisionsData(token);
    }
  }, [token]);

  {/* コメント機能 */}

  // const onCommentSubmit = (comment: string) => {
  //   // コメントのエラーハンドリング
  //   if(!selectedDecision || !currentUser || !comment || comment.length > 50) {
  //     setCommentError(true);
  //     return; // ここで処理を終了させる
  //   }

  //   // エラーがない場合、コメントを追加
  //   const newComment: Comment = {
  //     id: comments!.length + 1,
  //     content:     comment,
  //     user_id:     currentUser.id,
  //     decision_id: selectedDecision.id,
  //     created_at:  new Date().toISOString(),
  //     updated_at:  new Date().toISOString(),
  //   };

  //   setNewComment(newComment); // コメントを追加
  //   setIsCommentSet(true); // コメントが追加されたことを示すフラグを設定
  //   setCommentError(false); // エラー状態をリセット
  // }

  useEffect(() => {
    setFilteredDecisions(decisions!);
  }, [decisions]);

  useEffect(() => {
    if(isDrawerClick) {
      // ページ内のすべてのstateを初期化
      setSearchQuery('');
      setSelectedTag('');
      setSortOrder('date_new');
      setCurrentPage(1);
      setIsDrawerClick(false);
    }
  }, [isDrawerClick]);

  {/* ブックマーク機能 */}
  const [isBookmarked, setIsBookmarked] = useState(false);

  const onBookmarkToggle = (decisionId: number | null) => {
    // ブックマークが1つも存在しない場合
    if (!bookmarks || bookmarks.length === 0) {
      // handleBookmark();
      return;
    }

    const bookmarkId = bookmarks.find(bookmark => bookmark.decision_id === decisionId)?.id;
    // ブックマークが存在していて、かつ、選択された相談がブックマークされていない場合
    if (isBookmarked && bookmarkId) {
      // deleteBookmark(bookmarkId);
    } else {
      // handleBookmark();
    }
    setIsBookmarked(!isBookmarked);
  }

  useEffect(() => {
    if (selectedDecision && bookmarks!.map(bookmark => bookmark.decision_id).includes(selectedDecision.id)) {
      setIsBookmarked(true);
    } else if (selectedDecision && !bookmarks!.map(bookmark => bookmark.decision_id).includes(selectedDecision.id)) {
      setIsBookmarked(false);
    }
  }, [bookmarks])

  // ページネーションのために、表示するdecisionsを計算
  const indexOfLastItem  = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDecisions = filteredDecisions.slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredDecisions.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  // ページ番号を設定する関数
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)
  const paginateFirst = () => setCurrentPage(1);
  const paginateLast = () => setCurrentPage(pageNumbers.length);

  // useEffect(() => {
  //   let sortedDecisions = [...filteredDecisions];
  //   sortedDecisions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  //   setFilteredDecisions(sortedDecisions);
  // }, [decisions])

  useEffect(() => {
    handleSearch();
  }, [searchQuery, selectedTag, sortOrder]);

  const handleDecisionClick = (decision: MappedDecision) => {
    setSelectedDecision(decision);
  };

  const handleCloseDetail = () => {
    setSelectedDecision(undefined);
  };

  const handleSearch = () => {
    let filtered = decisions!;

    if (!searchQuery && !selectedTag) {
      setFilteredDecisions(decisions!);
      return;
    }
  
    if (selectedTag) {
      filtered = filtered.filter(decision => {
        // decision_tags に紐づく各タグが selectedTag と一致するか確認
        const filteredDecisionTags = decisionTags!.filter(decisionTag => decisionTag.decision_id === decision.id);
        return filteredDecisionTags.some(decision_tag => {
          // 対応するタグを tags 配列から検索
          const tag = tags!.find(tag => tag.id === decision_tag.tag_id);
          return tag && tag.name === selectedTag;
        });
      });
    }
  
    if (searchQuery) {
      filtered = filtered.filter(decision => {
        // decisionに紐づくconversationを取得
        // conversationのquery_textにsearchQueryが含まれているか確認
        const filteredConversations = conversations!.filter(conversation => conversation.decision_id === decision.id);
        return filteredConversations.some(conversation => conversation.query_text.includes(searchQuery));
      });
    }
    setFilteredDecisions(filtered);
  };
  
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement> ) => {
    const newSortOrder = e.target.value;
    setSortOrder(newSortOrder);
  
    let sortedDecisions = [...filteredDecisions];
    
    if (newSortOrder === 'date_new') {
      sortedDecisions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (newSortOrder === 'date_old') {
      sortedDecisions.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    } else if (newSortOrder === 'comments') {
      // 各decisionのidとcommentsのdecision_idを比較
      // commentsの数でソート
      // decisionの配列を更新
      sortedDecisions.sort((a, b) => {
        const aComments = comments!.filter(comment => comment.decision_id === a.id);
        const bComments = comments!.filter(comment => comment.decision_id === b.id);
        return bComments.length - aComments.length;
      });
    } else if (newSortOrder === 'bookmarks') {
      // 各decisionのidとbookmarksのdecision_idを比較
      // bookmarksの数でソート
      // decisionの配列を更新
      sortedDecisions.sort((a, b) => {
        const aBookmarks = bookmarks!.filter(bookmark => bookmark.decision_id === a.id);
        const bBookmarks = bookmarks!.filter(bookmark => bookmark.decision_id === b.id);
        return bBookmarks.length - aBookmarks.length;
      });
    }

    setFilteredDecisions(sortedDecisions);
  };

  const handleSearchWithTag = (tagToSearch: string) => {
    let filtered = decisions!;

    if (tagToSearch) {
      // decisionのidとdecision_tagsのdecision_idを比較
      // decision_tagsのtag_idとtagsのidを比較
      // tagsのnameとtagToSearchを比較
      // tagが一致するdecisionをfilteredに追加
      filtered = filtered.filter(decision => {
        const filteredDecisionTags = decisionTags!.filter(decisionTag => decisionTag.decision_id === decision.id);
        return filteredDecisionTags.some(decision_tag => {
          const tag = tags!.find(tag => tag.id === decision_tag.tag_id);
          return tag && tag.name === tagToSearch;
        });
      });
    }

    setFilteredDecisions(filtered);
  };

  const handleSelectTag = (tagName: string) => {
    setSelectedTag(tagName);
    setIsTagInputFocused(false);
    handleSearchWithTag(tagName);
  };

  const handleBlurSelectTag = (e: React.FocusEvent<HTMLInputElement>) => {
    // 少し遅延を入れて、子要素のクリックイベントが先に処理されるようにする
    setTimeout(() => {
      // refをチェックして、フォーカスが外れた要素がオートコンプリートリスト内でないことを確認
      if (autoCompleteTagsRef.current && !autoCompleteTagsRef.current.contains(e.relatedTarget as Node)) {
        setIsTagInputFocused(false);
      }
    }, 200); // 100ミリ秒の遅延
  };

  return (
    <>
      {/* 検索フォーム */}
      <div className='w-[70vw] mt-[2vh] mb-[3vh] flex'>
        <input
          id='searchText'
          type='text'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder='相談文を検索...'
          className='border p-2 mr-2'
        />
        <div className='flex flex-col'>
          <input
            id='searchTag'
            type='text'
            value={selectedTag}
            onChange={(e) => {
              setSelectedTag(e.target.value);
              handleSearchWithTag(e.target.value);
            }}
            onFocus={() => setIsTagInputFocused(true)}
            onBlur={(e) => handleBlurSelectTag(e)}
            placeholder='タグを検索...'
            className='border p-2 mr-2'
          />
          {/* オートコンプリートリスト */}
          {isTagInputFocused && (
            <div ref={autoCompleteTagsRef} className='absolute z-10 bg-white border rounded max-h-40 overflow-auto top-24 border-black shadow-lg'>
              {[blankTag, ...tags!].map(tag => (
                <div key={tag.id} onClick={() => handleSelectTag(tag.name)} className='p-2 hover:bg-gray-100 text-black'>
                  {tag.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <select onChange={handleSortChange} id='selectSort' className='ml-2'>
          <option value='date_new'>新しい順</option>
          <option value='date_old'>古い順</option>
          <option value='comments'>コメント数順</option>
          <option value='bookmarks'>ブックマーク数順</option>
        </select>
        <button onClick={handleSearch} className='ml-2 bg-blue-500 text-white px-4 py-2 rounded'>
          検索
        </button>
      </div>

      { !decisions && (
        <div></div>
      )}
      { decisions && (
        <>
          <div className='w-[70vw] mb-[5vh]'>
            {currentDecisions.map((decision) => {
              // DecisionCardに渡すpropsを設定
              // targetTags: (decision.id == decisionTagsの各要素decisionTag.decision_id)
              //             の条件を満たすdecisionTagsの各要素のtag_idに対応するtagsの各要素
              const targetDecisionTags = decisionTags!.filter((decisionTag) => decisionTag.decision_id === decision.id);
              const targetTags         = tags?.filter((tag) => targetDecisionTags.some((decisionTag) => decisionTag.tag_id === tag.id));

              const decisionComments      = comments      && comments.length      > 0 ? comments.filter((comment) => comment.decision_id === decision.id) : [];
              const decisionBookmarks     = bookmarks     && bookmarks.length     > 0 ? bookmarks.filter((bookmark) => bookmark.decision_id === decision.id) : [];
              const decisionConversations = conversations && conversations.length > 0 ? conversations.filter((conversation) => conversation.decision_id === decision.id) : [];
              const sortedConversations   = decisionConversations.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
              return (
                <div key={decision.id}
                    className='mb-4 shadow-lg rounded-lg'
                    onClick={() => handleDecisionClick(decision)}>
                  <DecisionCard
                    query_text={sortedConversations[0].query_text}
                    comments={decisionComments}
                    bookmarks={decisionBookmarks}
                    decision_tags={targetTags!}
                  />
                </div>
              )}
            )}
          </div>

          <Pagination
            postsPerPage={itemsPerPage}
            totalPosts={filteredDecisions.length}
            paginate={paginate}
            currentPage={currentPage}
            paginateFirst={paginateFirst}
            paginateLast={paginateLast}
          />

          {selectedDecision && (
            <DecisionModal
              decision={selectedDecision}
              conversations={conversations ? conversations.filter(convo => convo.decision_id === selectedDecision.id) : []}
              handleCloseDetail={handleCloseDetail}
              onBookmarkToggle={onBookmarkToggle}
              isBookmarked={isBookmarked}
              setIsBookmarked={setIsBookmarked}
            />
          )}
        </>
      )}
    </>
  );
}