'use client'

import { useState, useEffect } from 'react'

import { DecisionIndex } from '@/app/_components/decisions/DecisionIndex'
import { useDecisions } from '@/app/_contexts/_featureContexts/DecisionsContext'
import { getDecisions } from '@/app/_features/fetchAPI'
import { useDecisionsData } from '@/app/_hooks/_decisions/useDecisionsData'
import { Decision } from '@/app/_types'

export default function MyPageDecisions() {
  const [decisions, setDecisions] = useState<Decision[]>([])
  const { setIsLoading } = useDecisions()
  const { token } = useDecisionsData()

  const getDecisionsData = async (condition: string) => {
    setIsLoading(true)
    if (!token) return
    try {
      const decisions = await getDecisions({ token: token, condition: condition })
      setDecisions(decisions)
    } catch (error) {
      console.error('Error fetching decisions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void (async () => {
      await getDecisionsData('public')
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  return (
    <>
      <div className='flex flex-col items-center justify-start w-screen min-h-screen pt-[3rem]'>
        <DecisionIndex
          decisions={decisions}
          setDecisions={setDecisions}
          getDecisionsData={getDecisionsData}
        />
      </div>
    </>
  )
}
