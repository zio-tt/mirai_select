"use client"

import { Inter } from 'next/font/google'
import { useSession, SessionProvider } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Footer from './footer/layout';
import Header from './header/layout';
import Loading from './loading/layout';
import AuthGuard from '@/app/_features/AuthGuard';
import { useState, useEffect } from 'react';

const inter = Inter({ subsets: ['latin'] })

export type AppLayoutProps = {
  children: React.ReactNode
}

export default function AppLayout({children}: AppLayoutProps) {

  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Kiwi+Maru:wght@300&display=swap" rel="stylesheet" />
      </head>
      <body className={inter.className}>
        <SessionProvider>
          <LayoutContent children={children} />
        </SessionProvider>
      </body>
    </html>
  )
}

function LayoutContent( {children}: AppLayoutProps ){
  const { data: session, status } = useSession();
  const [hasVisited, setHasVisited] = useState<string>('');
  const isRoot = usePathname();
  console.log(status)

  useEffect(() => {
    let hasVisited = sessionStorage.getItem('hasVisited');
    return;
  }, [session, status])

  return(
    <div className='flex flex-col h-screen bg-white'>
      { isRoot == "/" && hasVisited != null && status == 'loading' && <Loading /> }
      { status != 'loading' && (
        <>
          <Header />
          <div className='pt-16 flex-grow flex justify-center' data-theme="fantasy">
            { isRoot == "/" && children }
            { isRoot != "/" && <AuthGuard children={children} /> }
          </div>
          <Footer />
        </>
      )}
    </div>
  );
}
