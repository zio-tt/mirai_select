'use client' // useEffectはクライアントサイドでのみ実行される

// Import
// Built-in components
import Image from 'next/image';
// Contexts
import { SessionProvider   } from 'next-auth/react';
import { HelperProvider    } from '@/app/_contexts/HelperContext';
import { TopPageProvider   } from '@/app/_contexts/TopPageContext';
import { DecisionsProvider } from '@/app/_contexts/DecisionsContext';
import { DrawerProvider    } from '@/app/_contexts/DrawerContext';
// Hooks
import { useState, useEffect } from 'react';
import { usePathname }         from 'next/navigation';
import { useSession }          from 'next-auth/react';
import { useTopPage }          from '@/app/_contexts/TopPageContext';
import { useRouter }           from 'next/navigation';
import { useDecisions }        from '@/app/_contexts/DecisionsContext';
// Fonts
import { Inter }    from 'next/font/google'
import { kiwimaru } from '@/app/_utils/font';
// Layouts
import { Drawer }           from './Drawer/layout';
import { Footer }           from './footer/layout';
import { Loading }          from './loading/layout';
import { FadeInAnimation }  from '../root/FadeInAnimation';
import { OpeningAnimation } from '../root/OpeningAnimation';
// Features
import AuthGuard           from '@/app/_features/auth/AuthGuard';
import GoogleAnalytics     from '@/app/_features/GoogleAnalytics/GoogleAnalytics';

// デフォルトではpreloadがtrueになっているのでsubsetsの指定が必要
const inter = Inter({ subsets: ['latin'] })

export type AppLayoutProps = {
  children: React.ReactNode
}

const LayoutContent = ( {children}: AppLayoutProps ) => {
  const { isViewed, setIsViewed } = useTopPage(); // Opening Animation Flag
  const [ isAuth, setIsAuth ] = useState<string | null>(null); // 認証状態
  const [ isAdmin, setIsAdmin ] = useState<boolean>(false); // 管理者権限
  const [ isLoading, setIsLoading ] = useState<boolean>(false); // ローディング画面
  const { data: session, status } = useSession();
  const { isModalOpen, setIsModalOpen } = useDecisions();
  const { isResetDecisions, setIsResetDecisions } = useDecisions();
  const router = useRouter();
  const isRoot = usePathname();

  useEffect(() => {
    setIsAuth(sessionStorage.getItem('unAuthFlag'));
    // 非認証の状態でルートにアクセスした場合、Openingアニメーションを表示する
    if (isRoot == '/' && status == 'unauthenticated') {
      setIsViewed(false);
    } else if (status == 'authenticated') {
      setIsViewed(true);
    }
    // 認証状態からサインアウトした場合、ルートにリダイレクトする
    if (isRoot != '/' && isAuth == 'true') {
      router.replace('/');
      sessionStorage.removeItem('unAuthFlag');
    }

    if (isRoot == '/admin') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [status]);

  useEffect(() => {
    setIsLoading(false);
    setIsResetDecisions(false);
  }, []);

  return(
    <div className={`relative w-screen min-h-screen ${kiwimaru.className}`}>
      {/* 背景画像とTopPageアニメーション */}
      <Image src='/images/background.png' alt='background' fill
              className='absolute top-50% left-50% min-w-full min-h-full object-cover z-0'/>
      {/* オープニングアニメーション */}
      { isRoot == "/" && status != 'loading' && !isViewed && <OpeningAnimation /> }
      { isAdmin && (children)}
      {/* メインコンテンツ */}
      { isViewed && !isAdmin && (
        <div className='flex w-full h-full'>
          <FadeInAnimation>
            <div className='flex flex-row w-screen h-full'>
              <Drawer />
                <div className='flex flex-col w-[80vw] h-full ml-[20vw]'>
                  { status == 'loading' && <Loading /> }
                  { status != 'loading' && 
                    <>
                      <main className='flex w-full min-h-[calc(100vh-4rem)] z-10 items-center'>
                        <AuthGuard children={children} />
                      </main>
                      { !isModalOpen && <Footer /> }
                    </>
                  }
                </div>
            </div>
          </FadeInAnimation>
        </div>
      )}
    </div>
  );
}

const AppLayout = ({children}: AppLayoutProps) => {
  return (
    <html lang='ja'>
      <head>
        <GoogleAnalytics />
        <link href='https://fonts.googleapis.com/css2?family=Kiwi+Maru:wght@300&display=swap' rel='stylesheet' />
      </head>

      <body className={inter.className}>
        <SessionProvider>
        <TopPageProvider>
        <HelperProvider>
        <DecisionsProvider>
        <DrawerProvider>
          <LayoutContent children={children} />
        </DrawerProvider>
        </DecisionsProvider>
        </HelperProvider>
        </TopPageProvider>
        </SessionProvider>
      </body>
    </html>
  )
}

export default AppLayout;