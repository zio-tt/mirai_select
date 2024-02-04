'use client'

import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { SessionProvider } from 'next-auth/react'

const App = dynamic(() => import('@/app/_components/layouts/Admin/Admin'), { ssr: false })

const Home: NextPage = () => {
  const [isAuth, setIsAuth] = useState<boolean>(false) // 認証状態
  const [id, setId] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  // eslintテスト
  const a = 1
  const a = 2

  const handleLogin = () => {
    if (
      id == process.env.NEXT_PUBLIC_ADMIN_ID &&
      password == process.env.NEXT_PUBLIC_ADMIN_PASSWORD
    ) {
      setIsAuth(true)
    } else {
      alert('IDまたはパスワードが間違っています')
    }
  }

  const idChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value)
  }

  const passwordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  if (!isAuth) {
    return (
      <div className='hero min-h-screen bg-base-200'>
        <div className='hero-content flex-col lg:flex-row-reverse'>
          <div className='card shrink-0 w-full max-w-sm shadow-2xl bg-base-100'>
            <form className='card-body'>
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>ID</span>
                </label>
                <input
                  type='text'
                  placeholder='ID'
                  value={id}
                  onChange={idChange}
                  className='input input-bordered'
                />
              </div>
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>Password</span>
                </label>
                <input
                  type='password'
                  placeholder='password'
                  value={password}
                  onChange={passwordChange}
                  className='input input-bordered'
                />
              </div>
              <div className='form-control mt-6'>
                <button className='btn btn-primary' onClick={handleLogin}>
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
  if (isAuth) {
    return (
      <SessionProvider>
        <App />
      </SessionProvider>
    )
  }
}

export default Home
