import React, { Component } from 'react';
import PublicHeader from './public';
import PrivateHeader from './private';
import { useSession } from 'next-auth/react';

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <header className='h-12 items-center justify-center'>
      {status === 'authenticated' ? <PrivateHeader /> : <PublicHeader />}
    </header>
  );
}