"use client"

import { Inter } from 'next/font/google'
import { useSession, SessionProvider } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Header from './header/layout';
import Footer from './footer/layout';
import Loading from './loading/layout';
import AuthGuard from '@/app/_features/AuthGuard';
import { useState, useEffect } from 'react';
import HelperProvider from '@/app/_features/helper/HelperContext';

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
        <SessionProvider><HelperProvider>
          <LayoutContent children={children} />
        </HelperProvider></SessionProvider>
      </body>
    </html>
  )
}

function LayoutContent( {children}: AppLayoutProps ){
  const { data: session, status } = useSession();
  const [ hasVisited, setHasVisited] = useState<string>('');
  const isRoot = usePathname();
  console.log(status)

  useEffect(() => {
    const storedHasVisited = sessionStorage.getItem('hasVisited');
    setHasVisited(storedHasVisited!);
    return;
  }, [session, status])

  return(
    <div className='flex flex-col h-screen w-screen' data-theme="dark">
      { isRoot == "/" && hasVisited != null && status == 'loading' && <Loading /> }
      { status != 'loading' && (
        <>
          <Header />
          <div className='pt-16 mx-16 flex-grow flex justify-center' data-theme="fantasy">
            { isRoot == "/" && children }
            { isRoot != "/" && <AuthGuard children={children} /> }
          </div>
          <Footer />
        </>
      )}
    </div>
  );
}
