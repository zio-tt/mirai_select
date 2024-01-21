'use client';

import { useEffect } from 'react';
import { useDecisions } from '@/app/_contexts/DecisionsContext';
import { useDecisionsData } from '@/app/_hooks/_decisions/useDecisionsData';
import DecisionIndex from '@/app/_components/decisions/DecisionIndex';
import { getDecisions } from '@/app/_features/fetchAPI';
import { HomeIcon } from '@heroicons/react/24/outline';
import { HeartIcon } from '@heroicons/react/24/outline';

export default function MyPageDecisions() {
  const { setDecisions } = useDecisions();
  const { setIsLoading } = useDecisions();
  const { token } = useDecisionsData();
  const { decisionsCondition, setDecisionsCondition } = useDecisions();

  const getDecisionsData = async (condition: string) => {
    setIsLoading(true);
    if (token) {
      const decisions = await getDecisions({ token: token, condition: condition });
      setDecisions(decisions);
    }
    setIsLoading(false);
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
    getDecisionsData(decisionsCondition);
  }, [decisionsCondition]);

  return (
    <>
      <div className='flex flex-col items-center justify-start w-screen min-h-screen pt-[5vh]'>
        {/* マイページメニュー */}
        <div className="w-[70vw] h-[5vh] flex justify-start">
          <button id='private'
                  onClick={(e) => handleFetchDecisions(e)}>
            <HomeIcon className={`h-full px-4 py-2  ${decisionsCondition === 'private' ? 'bg-blue-500 text-white' : 'text-black'}`} />
          </button>
          <button id='favorite'
                  onClick={(e) => handleFetchDecisions(e)}>
            <HeartIcon className={`h-full px-4 py-2 ${decisionsCondition === 'favorite' ? 'bg-blue-500 text-white' : 'text-black'}`} />
          </button>
        </div>
        <DecisionIndex />
      </div>
    </>
  );
}