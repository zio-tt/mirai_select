'use client';

import { signIn } from 'next-auth/react';
import type { MouseEvent } from 'react';

const handleLogin = async (event: MouseEvent<HTMLElement>) => {
  event.preventDefault();

  await signIn('google');
};

export default function PublicHeader() {
  return (
    <>
      <div className="fixed left-4 justify-center">
        <a href="/" className="text-xl text-gray-600 hover:underline ml-2">ミライセレクト</a>
        <p className='text-xs'>あなたの選択をサポートする</p>
      </div>
      <div className="fixed right-4">
        <a href="#" onClick={handleLogin} className="text-bs text-gray-600 hover:underline mr-2 ml-4">Google認証</a>
      </div>
    </>
  );
}