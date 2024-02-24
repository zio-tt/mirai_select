'use client'

import { UserCircleIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

import { useDecisions } from '@/app/_contexts/_featureContexts/DecisionsContext'

import type { JSX } from 'react'

export const GuestMenu = (): JSX.Element => {
  const { setDecisionsCondition } = useDecisions()

  return (
    <div tabIndex={0} role='button' className='btn btn-ghost bg-white mr-4'>
      <Link href='/guest/decisions' onClick={() => setDecisionsCondition('public')}>
        <div className='flex flex-row h-10 items-center justify-center'>
          <div className='flex h-6 mr-1'>
            <UserCircleIcon />
          </div>
          <div className='flex h-6 items-center'>みんなの悩み事</div>
        </div>
      </Link>
    </div>
  )
}
