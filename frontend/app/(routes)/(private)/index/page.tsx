'use client';

import { useState, useEffect } from 'react';
import { useIndex } from '@/app/_contexts/IndexContext';
import { useHelper } from '@/app/_contexts/HelperContext';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { DecisionCard } from './_components/DecisionCard';
import { DecisionDetail } from './_components/DecisionDetail';
import { Decision, Conversation, Character, 
         CharacterResponse, User, Comment, 
         Bookmark, Tag, DecisionTag } from '@/app/_types';

interface DecisionIndex extends Decision {
  user: User;
  comments: Comment[];
  bookmarks: Bookmark[];
  conversations: Conversation[];
  decision_tags: DecisionTag[];
  tags: Tag[];
  characters: Character[];
  character_responses: CharacterResponse[][];
}

export default function decisionIndex() {
  const [decisions, setDecisions] = useState<DecisionIndex[]>([]);
  const [filteredDecisions, setFilteredDecisions] = useState<DecisionIndex[]>([]);
  const [isTagInputFocused, setIsTagInputFocused] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const blankTag = { id: 0, name: '' }
  const [selectedDecision, setSelectedDecision] = useState<DecisionIndex | null>(null);
  const { openModal, setOpenModal } = useIndex();
  const { data: session } = useSession();
  const token = session?.appAccessToken;

  const { isDrawerClick, setIsDrawerClick } = useHelper();

  const [searchQuery, setSearchQuery] = useState(''); // 相談文の検索キーワード
  const [selectedTag, setSelectedTag] = useState(''); // 選択されたタグ
  const [sortOrder, setSortOrder] = useState('date_new'); // 並べ替えの順序

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // 1ページあたりのアイテム数

  // コメント用の定義
  const [comments, setComments] = useState<Comment[]>([]);
  const onCommentSubmit = (comment: string) => {
    if(!selectedDecision) return;
    const newComment:Comment = {
      id: comments.length + 1,
      content: comment,
      user_id: selectedDecision.user.id,
      decision_id: selectedDecision.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setComments([...comments, newComment]);
  }

  useEffect(() => {
    fetchComments();
  }, [comments]);

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
      console.log(response);
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

  const fetchDecisions = async () => {
    try {
      const response = await axios({
        method: 'post',
        url: `${process.env.NEXT_PUBLIC_API_URL}/api/index/`,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true,
      });
      console.log(response);
      if (response.status === 200) {
        setDecisions(response.data.decisions);
        setTags(response.data.tags);
      }
    } catch (error) {
      console.error('Error fetching decisions', error);
    }
  };

  useEffect(() => {
    fetchDecisions();
  }, []);

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
    setSelectedDecision(null);
    setOpenModal(false);
  };

  const handleSearch = () => {
    let filtered = decisions;
  
    if (selectedTag) {
      filtered = filtered.filter(decision => {
        // decision_tags に紐づく各タグが selectedTag と一致するか確認
        return decision.decision_tags.some(decision_tag => {
          // 対応するタグを tags 配列から検索
          const tag = tags.find(tag => tag.id === decision_tag.tag_id);
          return tag && tag.name === selectedTag;
        });
      });
    }
  
    if (searchQuery) {
      filtered = filtered.filter(decision => 
        decision.conversations.some(convo => convo.query_text && convo.query_text.includes(searchQuery)) ||
        decision.character_responses[0].some(response => response.response && response.response.includes(searchQuery))
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

  const handleSelectTag = (tagName: string) => {
    console.log("Tag selected:", tagName); // このログが表示されるかチェック
    setSelectedTag(tagName);
    setIsTagInputFocused(false);
    handleSearchWithTag(tagName);
  };

  const handleSearchWithTag = (tagToSearch: string) => {
    let filtered = decisions;
    
    if (tagToSearch) {
      filtered = filtered.filter(decision => {
        return decision.decision_tags.some(decision_tag => {
          const tag = tags.find(tag => tag.id === decision_tag.tag_id);
          return tag && tag.name === tagToSearch;
        });
      });
    }
  
    setFilteredDecisions(filtered);
  };

  return (
    <div className='flex flex-col items-center justify-start w-screen min-h-screen pt-[5vh]'>
      {/* 検索フォーム */}
      <div className='w-[70vw] mt-[2vh] mb-[3vh] flex'>
        <input
          type='text'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder='相談文を検索...'
          className='border p-2 mr-2'
        />
        <div className='flex flex-col'>
          <input
            type='text'
            value={selectedTag}
            onChange={(e) => {
              setSelectedTag(e.target.value);
              handleSearchWithTag(e.target.value);
            }}
            onFocus={() => setIsTagInputFocused(true)}
            placeholder='タグを検索...'
            className='border p-2 mr-2'
          />
          {/* オートコンプリートリスト */}
          {isTagInputFocused && (
            <div className='absolute z-10 bg-white border rounded max-h-40 overflow-auto top-24 border-black shadow-lg'>
              {[blankTag, ...tags].map(tag => (
                <div key={tag.id} onClick={() => handleSelectTag(tag.name)} className='p-2 hover:bg-gray-100 text-black'>
                  {tag.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <select onChange={handleSortChange} className='ml-2'>
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
        {currentDecisions.map((decision) => (
          <div key={decision.id}
               className='mb-4 shadow-lg rounded-lg'
               onClick={() => handleDecisionClick(decision)}>
            <DecisionCard
              query_text={decision.conversations[0].query_text}
              user={decision.user}
              comments={decision.comments}
              bookmarks={decision.bookmarks}
              decision_tags={
                decision.decision_tags.map((decision_tag) => {
                  return {
                    id: decision_tag.tag_id,
                    name: tags.find((tag) => tag.id === decision_tag.tag_id)?.name,
                  };
                })
              }
            />
          </div>
        ))}
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
                  character_responses={selectedDecision.character_responses}
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