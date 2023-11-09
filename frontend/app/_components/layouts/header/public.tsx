'use client';

import { signIn } from 'next-auth/react';
import type { MouseEvent } from 'react';

const handleLogin = async (event: MouseEvent<HTMLElement>) => {
  event.preventDefault();

  await signIn('google');
};

export default function PublicHeader() {
  return (
    <header>
      <div className="fixed top-4 left-4 z-10">
        <a href="/" className="text-sm text-gray-600 hover:underline ml-2">ミライセレクト</a>
      </div>
      <div className="fixed top-4 right-4 z-10">
        <a href="#" onClick={handleLogin} className="text-sm text-gray-600 hover:underline mr-2 ml-4">Google認証</a>
      </div>
    </header>
  );
}