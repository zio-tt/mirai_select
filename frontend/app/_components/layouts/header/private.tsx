import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import HeaderLogo from './components/HeaderLogo';
import HeaderMenu from './components/HeaderMenu';
import handleLogout from '@/app/_features/handleLogout';
import Link from 'next/link';

const PublicHeader = () => {
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
      <HeaderLogo />
      <div className="fixed right-4 flex items-center mr-16">
        <HeaderMenu url="/helper" text="決断ヘルパー" />
        <HeaderMenu url="/index" text="みんなの悩みごと" />
        <Link href="#" onClick={handleLogout} className="w-12 h-12 bg-gray-200 mr-3 ml-3 rounded-full items-center justify-center overflow-hidden flex-shrink-1 block">
          {avatar.length > 0 && (
            <Image src={avatar} alt="アバター画像" width={100} height={100} className="flex object-cover" />
          )}
        </Link>
      </div>
    </>
  );
}

export default PublicHeader;