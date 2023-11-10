import React, { Component } from 'react';
import PublicHeader from './public';
import PrivateHeader from './private';
import { useSession } from 'next-auth/react';

function isAuthenticated() {
  const { data: session, status } = useSession();

  if (status == 'authenticated') {
    return <PrivateHeader />
  } else {
    return <PublicHeader />
  }
}

export default function Header() {
  return (
    <header className='h-14 justify-center bg-white'>
      {isAuthenticated}
    </header>
  );
}