'use client';

import { useEffect, useState } from 'react';
import { Loading }  from '@/app/_components/layouts/loading/layout';
import { useDecisions } from '@/app/_contexts/DecisionsContext';
import { useDecisionsData } from '@/app/_hooks/_decisions/useDecisionsData';
import DecisionIndex from '@/app/_components/decisions/DecisionIndex';
import { getDecisions } from '@/app/_features/fetchAPI';

export default function MyPageDecisions() {
  const { setDecisions } = useDecisions();
  const { isLoading } = useDecisions();
  const { token } = useDecisionsData();
  const { decisionsCondition, setDecisionsCondition } = useDecisions();

  const getDecisionsData = async (condition: string) => {
    if (token) {
      const decisions = await getDecisions({ token: token, condition: condition });
      setDecisions(decisions);
    }
  }

  const handleFetchDecisions = (e: React.MouseEvent<HTMLButtonElement>) => {
    const condition = e.currentTarget.id;
    getDecisionsData(condition);
    setDecisionsCondition(condition);
  };

  useEffect(() => {
    setDecisionsCondition('private');
  }, []);

  useEffect(() => {
    if (token) {
      getDecisionsData(decisionsCondition);
    }
  }, [decisionsCondition]);

  return (
    <>
    {isLoading && <Loading />}
    {!isLoading && (
      <div className='flex flex-col items-center justify-start w-screen min-h-screen pt-[5vh]'>
        {/* マイページメニュー */}
        <div className='w-[70vw] mt-[2vh] flex justify-start'>
          <button 
            id='private'
            className={`px-4 py-2 ${decisionsCondition === 'private' ? 'bg-blue-500 text-white' : ''}`} 
            onClick={(e) => handleFetchDecisions(e)}>
            My Posts
          </button>
          <button 
            id='favorite'
            className={`px-4 py-2 ${decisionsCondition === 'favorite' ? 'bg-blue-500 text-white' : ''}`} 
            onClick={(e) => handleFetchDecisions(e)}>
            Favorites
          </button>
        </div>
        <DecisionIndex />
      </div>
    )}
    </>
  );
}