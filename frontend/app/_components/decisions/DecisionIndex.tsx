'use client';

import { useState, useEffect, useRef, use } from 'react';
import { useSession } from 'next-auth/react';
import { DecisionCard } from '@/app/_components/decisions/DecisionCard';
import { DecisionModal } from '@/app/_components/decisions/Detail/DecisionModal';
import { Decision } from '@/app/_types';
import { Pagination } from '@/app/_components/decisions/Pagination/Pagination';
import { useDecisions } from '@/app/_contexts/DecisionsContext';
import { useDecisionsData } from '@/app/_hooks/_decisions/useDecisionsData';
import { useSearchDecisions } from '@/app/_hooks/_decisions/useSearchDecisions';
import { useSortDecisions } from '@/app/_hooks/_decisions/useSortDecisions';
import { useDrawer } from '@/app/_contexts/DrawerContext';
import { deleteDecision } from '@/app/_features/fetchAPI';

import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { TrashIcon } from '@heroicons/react/24/outline';

export default function DecisionIndex() {
  // initial state
  const { selectedDecision, setSelectedDecision } = useDecisions();
  const { decisionsCondition } = useDecisions();
  const { token, setToken } = useDecisionsData();
  const { setIsLoading } = useDecisions();
  const { setDecisions } = useDecisions();

  const { decisions,
          conversations,
          comments,
          bookmarks,
          decisionTags,
          tags,
        } = useDecisionsData();
        
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

  // エラーハンドリング
  // 状態を取得、更新時に特定の値が空の場合、return要素に何も表示しない
  // 特に、decisions, filteredDecisions, conversationsが空の場合は表示しない

  useEffect(() => {
    if(session) {
      setToken(session?.appAccessToken!);
    }
  }, [session]);

  useEffect(() => {
    setFilteredDecisions(decisions!);
  }, [decisions]);

  useEffect(() => {
    if(isDrawerClick) {
      // ページ内のすべてのstateを初期化
      setSearchQuery('');
      setSelectedTag('');
      setSelectedDecision(undefined);
      setSortOrder('date_new');
      setCurrentPage(1);
      setIsDrawerClick(false);
    }
  }, [isDrawerClick]);

  const pageNumbers = [];

  // ページネーションのために、表示するdecisionsを計算
  const indexOfLastItem  = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDecisions = filteredDecisions && filteredDecisions.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    if (!filteredDecisions) return;
    for (let i = 1; i <= Math.ceil(filteredDecisions.length / itemsPerPage); i++) {
      pageNumbers.push(i);
    }
  }, [filteredDecisions]);

  // ページ番号を設定する関数
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)
  const paginateFirst = () => setCurrentPage(1);
  const paginateLast = () => setCurrentPage(pageNumbers.length);

  useEffect(() => {
    useSearchDecisions(
      decisions,
      conversations,
      tags,
      decisionTags,
      searchQuery,
      selectedTag,
      sortOrder,
      filteredDecisions,
      setFilteredDecisions
    );
  }, [searchQuery, selectedTag, sortOrder]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    useSortDecisions(
      e.target.value,
      setSortOrder,
      filteredDecisions,
      setFilteredDecisions,
      comments,
      bookmarks,
    );
  }

  const handleDecisionClick = (decision: Decision) => {
    setSelectedDecision(decision);
  };

  const handleCloseDetail = () => {
    setSelectedDecision(undefined);
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

  const handleDeleteDecision = (decisionId: number) => async () => {
    if (confirm('本当に削除しますか？')) {
      setIsLoading(true);
      const response = await deleteDecision({ token: token!, decisionId: decisionId });
      setDecisions(response);
      setFilteredDecisions(response);
      setIsLoading(false);
    }
  }

  if (!decisions || !filteredDecisions || !conversations) return <></>;
  return (
    <>
      {/* 検索フォーム */}
      <div className='w-[70vw] mt-[2vh] mb-[3vh] flex relative '>
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
              {[blankTag, ...tags!].map(tag => (
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

      { !decisions && (
        <div></div>
      )}
      { decisions && (
        <>
          <div className='w-[70vw] mb-[5vh] flex justify-start flex-col'>
            {currentDecisions && currentDecisions.map((decision) => {
              // DecisionCardに渡すpropsを設定
              // targetTags: (decision.id == decisionTagsの各要素decisionTag.decision_id)
              //             の条件を満たすdecisionTagsの各要素のtag_idに対応するtagsの各要素
              const targetDecisionTags = decisionTags!.filter((decisionTag) => decisionTag.decision_id === decision.id);
              const targetTags         = tags?.filter((tag) => targetDecisionTags.some((decisionTag) => decisionTag.tag_id === tag.id));

              const decisionComments      = comments      && comments.length      > 0 ? comments.filter((comment) => comment.decision_id === decision.id) : [];
              const decisionBookmarks     = bookmarks     && bookmarks.length     > 0 ? bookmarks.filter((bookmark) => bookmark.decision_id === decision.id) : [];
              const decisionConversations = conversations && conversations.length > 0 ? conversations.filter((conversation) => conversation.decision_id === decision.id) : [];
              const sortedConversations   = decisionConversations.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

              if ( !sortedConversations[0] ) return;
              return (
                <div key={decision.id}
                     className='flex flex-row items-center'>
                  <div className='flex mb-4 mr-6 w-[80%] shadow-lg rounded-lg'
                       onClick={() => handleDecisionClick(decision)}>
                    <DecisionCard
                      query_text={sortedConversations[0].query_text}
                      comments={decisionComments}
                      bookmarks={decisionBookmarks}
                      decision_tags={targetTags!}
                    />
                  </div>
                  { decisionsCondition === 'private' && (
                      <TrashIcon onClick={handleDeleteDecision(decision.id)} className='w-[3vw] flex text-black' />
                  )}
                </div>
              )}
            )}
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
              conversations={conversations ? conversations.filter(convo => convo.decision_id === selectedDecision.id) : []}
              handleCloseDetail={handleCloseDetail}
            />
          )}
        </>
      )}
    </>
  );
}