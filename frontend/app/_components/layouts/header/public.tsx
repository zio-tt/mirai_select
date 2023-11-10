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
      <div className="fixed top-3 left-4">
        <a href="/" className="text-bs text-gray-600 hover:underline ml-2">ミライセレクト</a>
      </div>
      <div className="fixed top-3 right-4">
        <a href="#" onClick={handleLogin} className="text-bs text-gray-600 hover:underline mr-2 ml-4">Google認証</a>
      </div>
    </>
  );
}