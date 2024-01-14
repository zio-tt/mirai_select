'use client';

import { useState, useEffect, useRef } from 'react';
import { useIndex } from '@/app/_contexts/IndexContext';
import { useHelper } from '@/app/_contexts/HelperContext';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { DecisionCard } from './_components/DecisionCard';
import { DecisionDetail } from './_components/DecisionDetail';
import { Decision, Conversation, CharacterResponse, Comment, Bookmark, Tag } from '@/app/_types';

interface ConversationIndex extends Conversation {
  character_responses: CharacterResponse[];
}

interface Character {
  id:         number;
  name:       string;
  avatar:     string;
}

interface User {
  id:     number;
  name:   string;
  avatar: string;
}


interface DecisionIndex extends Decision {
  conversations:       ConversationIndex[];
  characters:          Character[];
  decision_tags:       number[]; // tag_id の配列
  comments:            Comment[];
  bookmarks:           Bookmark[];
}

export default function myPage() {
  // initial state
  const [users, setUsers]         = useState<User[]>([]);
  const [decisions, setDecisions] = useState<DecisionIndex[]>([]);
  const [tags, setTags]           = useState<Tag[]>([]);

  const { data: session, status } = useSession();

  const [filteredDecisions, setFilteredDecisions] = useState<DecisionIndex[]>([]);
  const blankTag = { id: 0, name: '' }
  const [selectedDecision, setSelectedDecision] = useState<DecisionIndex>();
  const { openModal, setOpenModal } = useIndex();

  const { isDrawerClick, setIsDrawerClick } = useHelper();

  const [searchQuery, setSearchQuery] = useState(''); // 相談文の検索キーワード
  const [selectedTag, setSelectedTag] = useState(''); // 選択されたタグ
  const [sortOrder, setSortOrder] = useState('date_new'); // 並べ替えの順序

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // 1ページあたりのアイテム数

  // オートコンプリート
  const [isTagInputFocused, setIsTagInputFocused] = useState(false);
  const autoCompleteTagsRef = useRef<HTMLDivElement>(null);


  const token = session?.appAccessToken;

  {/* ページ読み込み時の動作 */}
  useEffect(() => {
    fetchDecisions();
  }, []);

  const fetchDecisions = async () => {
    const fetchDecisionsCondition = "private"
    try {
      const response = await axios({
        method: 'post',
        url: `${process.env.NEXT_PUBLIC_API_URL}/api/user/decision`,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Authorization': `Bearer ${token}`
        },
        data: { fetchDecisionsCondition },
        withCredentials: true,
      });
      if (response.status === 200) {
        setUsers(response.data.users);
        setDecisions(response.data.decisions);
        setTags(response.data.tags);
      }
    } catch (error) {
      console.error('Error fetching decisions', error);
    }
  };

  // コメント用の定義
  const [comments, setComments] = useState<Comment[]>([]);
  const onCommentSubmit = (comment: string) => {
    if(!selectedDecision) return;
    const newComment:Comment = {
      id: comments.length + 1,
      content:     comment,
      user_id:     selectedDecision.user_id,
      decision_id: selectedDecision.id,
      created_at:  new Date().toISOString(),
      updated_at:  new Date().toISOString(),
    };
    setComments([...comments, newComment]);
  }

  useEffect(() => {
    if(selectedDecision && comments){
      fetchComments();
    }
  }, [ selectedDecision, comments]);

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

  const fetchComments = async () => {
    try {
      const response = await axios({
        method: 'post',
        url: `${process.env.NEXT_PUBLIC_API_URL}/api/comments/`,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Authorization': `Bearer ${token}`
        },
        data: { selectedDecision, comments },
        withCredentials: true,
      });
      if (response.status === 200) {
        setComments(response.data.comments);
      }
    } catch (error) {
      console.error('Error fetching comments', error);
    }
  }

  // ブックマーク用の定義
  const [isBookmarked, setIsBookmarked] = useState(false);
  const onBookmarkToggle = () => {
    setIsBookmarked(!isBookmarked);
  }

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



  useEffect(() => {
    // decisions が更新されたら、filteredDecisions も更新
    let sortedDecisions = [...filteredDecisions];
    sortedDecisions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    setFilteredDecisions(decisions);
  }, [decisions]);

  useEffect(() => {
    // searchQuery が更新されたら、filteredDecisions も更新
    handleSearch();
  }, [searchQuery, selectedTag, sortOrder]);

  const handleDecisionClick = (decision: DecisionIndex) => {
    setSelectedDecision(decision);
    setOpenModal(true);
  };

  const handleCloseDetail = () => {
    setSelectedDecision(undefined);
    setOpenModal(false);
  };

  const handleSearch = () => {
    let filtered = decisions;
  
    if (selectedTag) {
      filtered = filtered.filter(decision => {
        // decision_tags に紐づく各タグが selectedTag と一致するか確認
        return decision.decision_tags.some(decision_tag => {
          // 対応するタグを tags 配列から検索
          const tag = tags.find(tag => tag.id === decision_tag);
          return tag && tag.name === selectedTag;
        });
      });
    }
  
    if (searchQuery) {
      filtered = filtered.filter(decision => 
        decision.conversations.some(convo => convo.query_text && convo.query_text.includes(searchQuery)) ||
        decision.conversations.some(convo => convo.character_responses.some(res => res.response && res.response.includes(searchQuery)))
      );
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
      sortedDecisions.sort((a, b) => b.comments.length - a.comments.length);
    } else if (newSortOrder === 'bookmarks') {
      sortedDecisions.sort((a, b) => b.bookmarks.length - a.bookmarks.length);
    }

    setFilteredDecisions(sortedDecisions);
  };

  const handleSearchWithTag = (tagToSearch: string) => {
    let filtered = decisions;

    if (tagToSearch) {
      filtered = filtered.filter(decision => {
        return decision.decision_tags.some(decision_tag => {
          const tag = tags.find(tag => tag.id === decision_tag);
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
    <div className='flex flex-col items-center justify-start w-screen min-h-screen pt-[5vh]'>
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
              {[blankTag, ...tags].map(tag => (
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

      <div className='w-[70vw] mb-[5vh]'>
        {currentDecisions.map((decision) => {
          const decisionTags = tags.filter((tag) => decision.decision_tags.includes(tag.id));
          return (
            <div key={decision.id}
                className='mb-4 shadow-lg rounded-lg'
                onClick={() => handleDecisionClick(decision)}>
              <DecisionCard
                decision_id={decision.id}
                query_text={decision.conversations[0].query_text}
                user={users.find((user) => user.id === decision.user_id)}
                comments={decision.comments}
                bookmarks={decision.bookmarks}
                decision_tags={decisionTags}
              />
            </div>
          );}
        )}
      </div>

      <div className='pagination flex justify-center items-center my-4'>
        <button onClick={paginateFirst} className='page-link text-lg mx-2 text-black'>{'<<'}</button>
        {pageNumbers.map(number => (
          number >= currentPage - 2 && number <= currentPage + 2 && (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`page-link text-lg mx-2 ${currentPage === number ? 'text-blue-500 font-bold' : 'text-black'}`}
            >
              {number}
            </button>
          )
        ))}
        <button onClick={paginateLast} className='page-link text-lg mx-2 text-black'>{'>>'}</button>
      </div>

      {selectedDecision && (
        <div className='fixed inset-0 flex items-center justify-center z-10'>
          <div className='fixed inset-0 bg-black bg-opacity-50' onClick={handleCloseDetail}></div>
          <div className="flex w-[80vw] ml-[20vw] h-[100vh] items-center justify-center">
            <div className="flex flex-col w-[80%] h-[80%] bg-white p-5 rounded-lg items-center z-20">
              <div className='flex justify-center items-start'>
                <DecisionDetail
                  conversations={selectedDecision.conversations}
                  characters={selectedDecision.characters}
                  comments={comments}
                  onCommentSubmit={onCommentSubmit}
                  isBookmarked={isBookmarked}
                  onBookmarkToggle={onBookmarkToggle}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}