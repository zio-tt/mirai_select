"use client"

import Image from 'next/image';
import { Inter } from 'next/font/google'
import { useSession, SessionProvider } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Header from './header/layout';
import Footer from './footer/layout';
import Loading from './loading/layout';
import AuthGuard from '@/app/_features/AuthGuard';
import { useState, useEffect } from 'react';
import HelperProvider from '@/app/_features/helper/HelperContext';
import { Noto_Sans_JP } from 'next/font/google';
import { Kiwi_Maru } from 'next/font/google';
import { FloatingCircles } from './floating_circle/FloatingCircles';
import TopPageProvider from '@/app/_features/top/TopPageContext';
import { useTopPage } from '@/app/_features/top/TopPageContext';
import { motion } from 'framer-motion';

export const notojp = Noto_Sans_JP({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const kiwimaru = Kiwi_Maru({
  weight: "300",
  subsets: ["latin"],
  display: "swap",
});

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
        <SessionProvider><TopPageProvider><HelperProvider>
          <LayoutContent children={children} />
        </HelperProvider></TopPageProvider></SessionProvider>
      </body>
    </html>
  )
}

function LayoutContent( {children}: AppLayoutProps ){
  const { data: session, status } = useSession();
  const [ hasVisited, setHasVisited] = useState<string>('');
  const isRoot = usePathname();
  const { isViewed, setIsViewed } = useTopPage();
  console.log(status)
  console.log(isRoot)

  useEffect(() => {
    const storedHasVisited = sessionStorage.getItem('hasVisited');
    setHasVisited(storedHasVisited!);
    return;
  }, [session, status])

  return(
    <>
      <div className='flex flex-col' data-theme="fantasy">
        <div className="relative w-[100vw] h-[100vh] overflow-hidden">
          {/* 背景画像とその他の要素 */}
          {isRoot == '/' && <FloatingCircles />}
          <Image src="/images/background.png" alt="background" layout="fill"
                 className="absolute top-50% left-50% min-w-full min-h-full object-cover"/>
          { isRoot == '/' && <FloatingCircles />}
          { status != 'loading' && (
            <div className='flex flex-col overflow-auto'>
              { isViewed && (
                <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
                >
                  <Header />
                </motion.div>
              )}
              <div className={`${kiwimaru.className} flex-grow flex`} data-theme="fantasy">
                { isRoot == "/" && children }
                { isRoot != "/" && <AuthGuard children={children} /> }
              </div>
              <Footer />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
