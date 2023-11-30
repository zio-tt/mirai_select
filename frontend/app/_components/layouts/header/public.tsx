'use client';

import { signIn } from 'next-auth/react';
import type { MouseEvent } from 'react';
import { useTopPage } from '@/app/_features/top/TopPageContext';

export default function PublicHeader() {
  const { isAuthenticated, setIsAuthenticated } = useTopPage();

  console.log(isAuthenticated);
  const handleLogin = async (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    const result = await signIn('google', { redirect: false });
    //if (result?.status === 200) {
    //}
    return;
  };

  return (
    <>
      <div className="fixed left-4 justify-center ml-16">
        <a href="/" className="text-xl hover:underline ml-2">ミライセレクト</a>
        <p className='text-xs'>あなたの選択をサポートする</p>
      </div>
      <div className="fixed right-4 mr-16">
        <a href="#" onClick={handleLogin} className="text-bs hover:underline mr-2 ml-4">Google認証</a>
      </div>
    </>
  );
}