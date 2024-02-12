'use client'

import Image from 'next/image'
import Link from 'next/link'
import { signIn } from 'next-auth/react'

import type { JSX, MouseEvent } from 'react'

const handleLogin = async (e: MouseEvent<HTMLElement>) => {
  e.preventDefault()

  await signIn('google')
}

export const GoogleLoginButton = (): JSX.Element => {
  return (
    <Link
      id='authenticate'
      href='#'
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onClick={(e) => handleLogin(e)}
      className='flex flex-row items-center justify-center p-3 rounded-full bg-base-100 hover:bg-[#ffcf82]'
    >
      <div className='flex h-6 w-6 mr-2 items-center justify-center overflow-hidden'>
        <Image
          src='/images/google.png'
          alt='Google認証'
          width={100}
          height={100}
          className='flex object-cover'
        />
      </div>
      <div className='flex'>Google認証</div>
    </Link>
  )
}
