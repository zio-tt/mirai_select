'use client';

import { signOut } from 'next-auth/react';
import type { MouseEvent } from 'react';

const handleLogin = async (event: MouseEvent<HTMLElement>) => {
  event.preventDefault();

  await signOut();
};

export default function PrivateHeader() {
  return (
    <header>
      <div className="fixed top-4 left-4 z-10">
        <a href="/" className="text-sm text-gray-600 hover:underline ml-2">ミライセレクト</a>
      </div>
      <div className="fixed top-4 right-4 z-10">
        <a href="#" onClick={handleLogin} className="text-sm text-gray-600 hover:underline mr-2 ml-4">サインアウト</a>
      </div>
    </header>
  );
}