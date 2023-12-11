'use client' // useEffectはクライアントサイドでのみ実行される

// Import
// React
import Image from 'next/image';
// Libraries
import { motion } from 'framer-motion';
// Contexts
import { SessionProvider } from 'next-auth/react';
import HelperProvider from '@/app/_contexts/HelperContext';
import TopPageProvider from '@/app/_contexts/TopPageContext';
// Hooks
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useTopPage } from '@/app/_contexts/TopPageContext';
import { useRouter } from 'next/navigation';
// Fonts
import { Inter } from 'next/font/google'
import { kiwimaru } from '@/app/_utils/font';
import { notojp } from '@/app/_utils/font';
// Layouts
import Header from './header/layout';
import Footer from './footer/layout';
import Loading from './loading/layout';
// Features
import { FloatingCircles } from './floating_circle/FloatingCircles';
import AuthGuard from '@/app/_features/auth/AuthGuard';

// デフォルトではpreloadがtrueになっているのでsubsetsの指定が必要
const inter = Inter({ subsets: ['latin'] })

export type AppLayoutProps = {
  children: React.ReactNode
}

const LayoutContent = ( {children}: AppLayoutProps ) => {
  const { data: session, status } = useSession();
  const [ hasVisited, setHasVisited] = useState<string>('');
  const { isViewed, setIsViewed } = useTopPage();
  const router = useRouter();
  const isRoot = usePathname();
  const unAuthFlag = sessionStorage.getItem('unAuthFlag');

  // Debug
  console.log("unAuthFlag: " + unAuthFlag)
  console.log("status: " + status)
  console.log("isRoot: " + isRoot)
  console.log("isViewed: " + isViewed)

  // OpeningAnimationFlag
  useEffect(() => {
    if(isRoot != '/'){setIsViewed(true)}
  }, [isRoot])

  // SignOut, redirect to root
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

const AppLayout = ({children}: AppLayoutProps) => {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Kiwi+Maru:wght@300&display=swap" rel="stylesheet" />
      </head>
      <body className={inter.className}>
        <SessionProvider>
        <TopPageProvider>
        <HelperProvider>
          <LayoutContent children={children} />
        </HelperProvider>
        </TopPageProvider>
        </SessionProvider>
      </body>
    </html>
  )
}

export default AppLayout;