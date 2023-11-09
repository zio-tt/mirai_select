import React, { Component } from 'react'
import PublicHeader from './public';
import PrivateHeader from './private';
import { useSession } from 'next-auth/react';

export default function Header() {
  const { data: session, status } = useSession();

  if (status == 'authenticated'){
    return <PrivateHeader />;
  } else if (status == 'unauthenticated') {
    return <PublicHeader />;
  } else {
    return;
  }
}