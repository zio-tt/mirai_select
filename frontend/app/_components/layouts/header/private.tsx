'use client';

import { signOut } from 'next-auth/react';
import type { MouseEvent } from 'react';

const handleLogout = async (event: MouseEvent<HTMLElement>) => {
  event.preventDefault();

  await signOut();
};

export default function PublicHeader() {
  return (
    <>
      <div className="fixed top-4 left-4">
        <a href="/" className="text-base text-gray-600 hover:underline ml-2">ミライセレクト</a>
      </div>
      <div className="fixed top-4 right-4">
        <a href="/helper" className="text-base text-gray-600 hover:underline mr-2 ml-4">決断ヘルパー</a>
        <a href="/index" className="text-base text-gray-600 hover:underline mr-2 ml-4">みんなの悩みごと</a>
        <a href="#" onClick={handleLogout} className="text-base text-gray-600 hover:underline mr-2 ml-4">サインアウト</a>
      </div>
    </>
  );
}