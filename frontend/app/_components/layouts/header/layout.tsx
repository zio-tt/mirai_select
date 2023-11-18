import React, { Component } from 'react';
import PublicHeader from './public';
import PrivateHeader from './private';
import { useSession } from 'next-auth/react';

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <header className='flex fixed h-16 w-screen items-center justify-center z-10' data-theme="dark">
      {status === 'authenticated' ? <PrivateHeader /> : <PublicHeader />}
    </header>
  );
}