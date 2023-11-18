'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import type { MouseEvent } from 'react';
import axios from 'axios';

const handleLogout = async (event: MouseEvent<HTMLElement>) => {
  event.preventDefault();
  try {
    await signOut();
    const destroySession = await axios({
      method: 'post',
      url: `${process.env.NEXT_PUBLIC_API_URL}/auth/google/logout`,
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
      withCredentials: true,
    });

    if (destroySession.status === 200) {
      console.log('Session destroyed successfully');
    } else {
      console.error('Error destroying session', destroySession);
    }
  } catch (error) {
    console.error('Catch error', error);
  }
};

export default function PublicHeader() {
  const [ avatar, setAvatar ]= useState<string>('');
  const { data: session, status } = useSession();

  useEffect(() => {
    const user_image = session?.user.image ? session.user.image : '';
    setAvatar(user_image);
  },[])

  return (
    <>
      <div className="fixed left-4 justify-center">
        <a href="/" className="text-xl hover:underline ml-2">ミライセレクト</a>
        <p className='text-xs'>あなたの選択をサポートする</p>
      </div>
      <div className="fixed right-4 flex items-center">
        <a href="/helper" className="text-base hover:underline mr-2 ml-4">決断ヘルパー</a>
        <a href="/index" className="text-base hover:underline mr-4 ml-4">みんなの悩みごと</a>
        <a href="#" onClick={handleLogout} className="w-12 h-12 bg-gray-200 rounded-full items-center justify-center overflow-hidden flex-shrink-0">
          {avatar.length > 0 && (
            <Image src={avatar} alt="アバター画像" width={144} height={144} className="object-cover" />
          )}
        </a>
      </div>
    </>
  );
}