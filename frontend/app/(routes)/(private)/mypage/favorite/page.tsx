/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useState, useEffect } from 'react'

import { DecisionIndex } from '@/app/_components/decisions/DecisionIndex'
import { MyPageMenu } from '@/app/_components/mypage/MyPageMenu'
import { useDecisions } from '@/app/_contexts/DecisionsContext'
import { getDecisions } from '@/app/_features/fetchAPI'
import { useDecisionsData } from '@/app/_hooks/_decisions/useDecisionsData'
import { Decision } from '@/app/_types'

export default function MyPageDecisions() {
  const [decisions, setDecisions] = useState<Decision[]>([])
  const { setIsLoading } = useDecisions()
  const { token } = useDecisionsData()

  const getDecisionsData = async (condition: string) => {
    setIsLoading(true)
    if (token) {
      const decisions = await getDecisions({ token: token, condition: condition })
      setDecisions(decisions)
    }
  }

  useEffect(() => {
    setIsLoading(false)
  }, [decisions])

  useEffect(() => {
    void (async () => {
      await getDecisionsData('favorite')
    })()
  }, [token])

  return (
    <>
      <div className='flex flex-col items-center justify-start w-screen min-h-screen pt-[3rem]'>
        <MyPageMenu />
        <DecisionIndex
          decisions={decisions}
          setDecisions={setDecisions}
          getDecisionsData={getDecisionsData}
        />
      </div>
    </>
  )
}
