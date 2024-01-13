// Built-in components
import Image from 'next/image';
import Link from 'next/link';
// Hooks
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useHelper } from '@/app/_contexts/HelperContext';
// Components
import { DrawerLogo } from './components/DrawerLogo';
import { DrawerMenu } from './components/DrawerMenu';
import { handleLogout } from '@/app/_features/auth/function';

const PrivateDrawer = () => {
  const { isDrawerClick, setIsDrawerClick } = useHelper();
  const [ avatar, setAvatar ]= useState<string>('');
  const { data: session } = useSession();
  const { remainingTokens } = useHelper();
  const isRoot = usePathname();

  useEffect(() => {
    if (session?.user.image) {
      setAvatar(session.user.image);
    } else {
      setAvatar('/images/logo.png');
    }
  });

  const initState = (e: React.MouseEvent<HTMLElement>) => {
    setIsDrawerClick(true);
  };

  return (
    <>
      <div id='logo-space'
          className='flex h-[20vh] w-full items-center justify-center'>
        <DrawerLogo />
      </div>
      <div id='menu-space'
           className='flex flex-col h-[60vh] w-full items-center justify-start'>
        <div className="divider divider-neutral mb-6">Menu</div>
        <DrawerMenu url='/helper'
                    imageURL="/images/comment.png"
                    onClick={initState}
                    text='決断ヘルパー' />
        <DrawerMenu url='/decisions'
                    imageURL="/images/sns.png"
                    onClick={initState}
                    text='みんなの悩みごと' />
        <DrawerMenu url='#'
                    imageURL="/images/human.png"
                    onClick={initState}
                    text='マイページ¥¥¥（現在準備中）' />
        <DrawerMenu url='#'
                    imageURL="/images/exit.png"
                    onClick={handleLogout}
                    text='ログアウト' />
      </div>
      <div className="information flex flex-col min-h-[20vh] items-center justify-start">
        <div className="divider divider-neutral">Information</div>
        {isRoot === '/helper' && (
          <p className='flex font-bold underline underline-offset-2'>残トークン：{remainingTokens}</p>
        )}
      </div>
    </>
  );
}

export { PrivateDrawer };