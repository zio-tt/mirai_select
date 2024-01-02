// Built-in components
import Image from 'next/image';
import Link from 'next/link';
// Hooks
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
// Components
import { DrawerLogo } from './components/DrawerLogo';
import { DrawerMenu } from './components/DrawerMenu';
import { handleLogout } from '@/app/_features/auth/function';

const PrivateDrawer = () => {
  const [ avatar, setAvatar ]= useState<string>('');
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user.image) {
      setAvatar(session.user.image);
    } else {
      setAvatar('/images/logo.png');
    }
  });

  return (
    <>
      <div id='logo-space'
          className='flex h-[20vh] w-full items-center justify-center'>
        <DrawerLogo />
      </div>
      <div id='menu-space'
           className='flex flex-col h-[80vh] w-full items-center justify-start'>
        <DrawerMenu url='/helper'
                    imageURL="/images/comment.png"
                    text='決断ヘルパー' />
        <DrawerMenu url='/index'
                    imageURL="/images/sns.png"
                    text='みんなの悩みごと' />
        <DrawerMenu url='/index'
                    imageURL="/images/human.png"
                    text='マイページ¥¥¥(現在実装中)' />
        <DrawerMenu url='#'
                    imageURL="/images/exit.png"
                    onClick={handleLogout}
                    text='ログアウト' />
      </div>
    </>
  );
}

export { PrivateDrawer };