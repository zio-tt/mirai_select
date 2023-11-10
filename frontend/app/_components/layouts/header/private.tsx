'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import type { MouseEvent } from 'react';


const handleLogout = async (event: MouseEvent<HTMLElement>) => {
  event.preventDefault();

  await signOut();
};

export default function PublicHeader() {
  const [ avatar, setAvatar ]= useState<string>('');
  const { data: session, status } = useSession();

  useEffect(() => {
    const user_image = session?.user.image ? session.user.image : '';
    setAvatar(user_image);
    console.log(avatar)
  },[])

  return (
    <>
      <div className="fixed top-3 left-4 z-10 items-center">
        <a href="/" className="text-base text-gray-600 hover:underline ml-2">ミライセレクト</a>
      </div>
      <div className="fixed right-4 z-10 flex items-center">
        <a href="/helper" className="text-base text-gray-600 hover:underline mr-2 ml-4">決断ヘルパー</a>
        <a href="/index" className="text-base text-gray-600 hover:underline mr-2 ml-4">みんなの悩みごと</a>
        <a href="#" onClick={handleLogout} className="w-12 h-12 bg-gray-200 rounded-full items-center justify-center overflow-hidden flex-shrink-0">
          <Image src={avatar} alt="アバター画像" width={144} height={144} className="object-cover" />
        </a>
      </div>
    </>
  );
}