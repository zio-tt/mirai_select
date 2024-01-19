'use client';

import { useState } from 'react';
import { Loading }  from '@/app/_components/layouts/loading/layout';
import MyDecisions       from './_components/MyDecisions';
import FavoriteDecisions from './_components/FavoriteDecisions';
import { useDecisions } from '@/app/_contexts/DecisionsContext';

export default function Decisions() {
  const { isLoading } = useDecisions();
  const [selectMenu, setSelectMenu] = useState('private');

  return (
    <>
    {isLoading && <Loading />}
    {!isLoading && (
      <div className='flex flex-col items-center justify-start w-screen min-h-screen pt-[5vh]'>
        {/* マイページメニュー */}
        <div className='w-[70vw] mt-[2vh] flex justify-start'>
          <button 
            className={`px-4 py-2 ${selectMenu === 'private' ? 'bg-blue-500 text-white' : ''}`} 
            onClick={() => setSelectMenu('private')}>
            My Posts
          </button>
          <button 
            className={`px-4 py-2 ${selectMenu === 'favorite' ? 'bg-blue-500 text-white' : ''}`} 
            onClick={() => setSelectMenu('favorite')}>
            Favorites
          </button>
        </div>
        { selectMenu === 'private'  && <MyDecisions />}
        { selectMenu === 'favorite' && <FavoriteDecisions />}
      </div>
    )}
    </>
  );
}