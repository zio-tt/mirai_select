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
import HelperProvider from '@/app/_contexts/HelperContext';
import { FloatingCircles } from './floating_circle/FloatingCircles';
import TopPageProvider from '@/app/_contexts/TopPageContext';
import { useTopPage } from '@/app/_contexts/TopPageContext';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { kiwimaru, notojp } from '@/app/_utils/font';

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
  const { isViewed, setIsViewed } = useTopPage();
  const router = useRouter();
  const isRoot = usePathname();
  const unAuthFlag = sessionStorage.getItem('unAuthFlag');

  {/* デバッグ用 */}
  console.log("unAuthFlag: " + unAuthFlag)
  console.log("status: " + status)
  console.log("isRoot: " + isRoot)
  console.log("isViewed: " + isViewed)

  useEffect(() => {
    if(isRoot != '/'){setIsViewed(true)}
  }, [isRoot])

  useEffect(() => {
    if (unAuthFlag === 'true') {
      router.push('/');
      sessionStorage.removeItem('unAuthFlag');
    }
  }, [unAuthFlag]);

  useEffect(() => {
    const storedHasVisited = sessionStorage.getItem('hasVisited');
    setHasVisited(storedHasVisited!);
    return;
  }, [session, status])

  return(
    <>
      <div  className={`${kiwimaru.className}`}>
        <div className="relative flex flex-col w-screen min-h-screen overflow-auto">
          {/* 背景画像とTopPageアニメーション */}
          <Image src="/images/background.png" alt="background" layout="fill"
                 className="absolute top-50% left-50% min-w-full min-h-full object-cover z-0"/>
          { isRoot && <FloatingCircles />}
          {/* ローディング画面 */}
          { status == 'loading' && <Loading />}
          {/* メインコンテンツ */}
          { status != 'loading' && (
            <div className='flex flex-col h-full'>
              { isViewed && (
                <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
                className='flex h-16 z-20'
                >
                  <Header />
                </motion.div>
              )}
              <div className='flex flex-grow w-screen min-h-screen z-10 items-center'>
                { isRoot == "/" && children }
                { isRoot != "/" && (
                  <>
                    <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1 }}
                    >
                      <AuthGuard children={children} />
                    </motion.div>
                  </>
                )}
              </div>
              { isViewed && (
                <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
                className='flex h-16 z-20'
                >
                  <Footer />
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
