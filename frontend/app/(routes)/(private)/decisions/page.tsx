'use client';

import { useEffect } from 'react';
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

  useEffect(() => {
    setDecisionsCondition('public');
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
        <DecisionIndex />
      </div>
    )}
    </>
  );
}