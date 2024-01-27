'use client';

export default function GuestDecisions() {
  return (
    <>
      <div className='flex flex-col items-center justify-start w-screen min-h-screen pt-[3rem]'>
      </div>
    </>
  );

}

// import { useEffect } from 'react';
// import { Loading }  from '@/app/_components/layouts/loading/layout';
// import { useDecisions } from '@/app/_contexts/DecisionsContext';
// import { useDecisionsData } from '@/app/_hooks/_decisions/useDecisionsData';

// import { getDecisions } from '@/app/_features/fetchAPI';

// export default function GuestDecisions() {
//   const { setDecisions } = useDecisions();
//   const { isResetDecisions, setIsResetDecisions } = useDecisions();
//   const { isLoading, setIsLoading } = useDecisions();
//   const { token } = useDecisionsData();
//   const { decisionsCondition, setDecisionsCondition } = useDecisions();

//   const getDecisionsData = async (condition: string) => {
//     setIsLoading(true);
//     setIsResetDecisions(true);
//     if (token) {
//       const decisions = await getDecisions({ token: token, condition: condition });
//       setDecisions(decisions);
//     }
//   }

//   useEffect(() => {
//     setIsLoading(false);
//     setIsResetDecisions(false);
//     setDecisionsCondition('public');
//   }, []);

//   useEffect(() => {
//     if (token) {
//       getDecisionsData(decisionsCondition);
//     }
//   }, [decisionsCondition]);

//   return (
//     <>
//       <div className='flex flex-col items-center justify-start w-screen min-h-screen pt-[3rem]'>
//         <DecisionIndex />
//       </div>
//     </>
//   );
// }