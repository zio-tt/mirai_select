"use client"

import { Inter } from 'next/font/google'
import { useSession, SessionProvider } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Footer from './footer/layout';
import Header from './header/layout';
import Loading from './loading/layout';
import AuthGuard from '@/app/_features/AuthGuard';

const inter = Inter({ subsets: ['latin'] })

export type AppLayoutProps = {
  children: React.ReactNode
}

export default function AppLayout({children}: AppLayoutProps) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <LayoutContent children={children} />
        </SessionProvider>
      </body>
    </html>
  )
}

function LayoutContent( {children}: AppLayoutProps ){
  const { status } = useSession();
  const isRoot = usePathname();

  if (status === 'loading') {
    return <Loading />;
  }

  return(
    <div className='flex flex-col h-screen bg-white'>
      <Header />
      <div className='flex-grow flex justify-center'>
        { isRoot != "/" && <AuthGuard children={children} /> }
        {children}
      </div>
      <Footer />
    </div>
  )
}
