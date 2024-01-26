'use client';

import type { JSX, MouseEvent } from 'react';
import Link from 'next/link';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { useDecisions } from '@/app/_contexts/DecisionsContext';

export const GuestMenu = (): JSX.Element => {
  const { setDecisionsCondition } = useDecisions();

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost bg-white mr-4">
        <div className="flex flex-row h-10 items-center justify-center">
          <div className='flex h-6 mr-1'><UserCircleIcon /></div>
          <div className='flex'>ゲストログイン</div>
        </div>
      </div>
      <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 mt-1">
        <li><Link href='/guest/decisions' onClick={() => setDecisionsCondition('public')}>みんなの悩み事</Link></li>
        <li><Link href='#'>体験ページ</Link></li>
      </ul>
    </div>
  );
};