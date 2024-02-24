/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-page-custom-font */
'use client' // useEffectはクライアントサイドでのみ実行される

import { Inter } from 'next/font/google'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { SessionProvider, useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'

import {
  CharacterListProvider,
  useCharacterList,
} from '@/app/_contexts/_featureContexts/CharacterListContext'
import { DecisionsProvider } from '@/app/_contexts/_featureContexts/DecisionsContext'
import { DrawerProvider, useDrawer } from '@/app/_contexts/_featureContexts/DrawerContext'
import { HelperProvider, useHelper } from '@/app/_contexts/_featureContexts/HelperContext'
import {
  TopPageProvider,
  useTopPage,
} from '@/app/_contexts/_featureContexts/TopPageContext'
import {
  CharacterProvider,
  useCharacter,
} from '@/app/_contexts/_globalContexts/CharacterContext'
import {
  GlobalStateProvider,
  useGlobalState,
} from '@/app/_contexts/_globalContexts/GlobalStateContext'
import {
  UserInfoProvider,
  useUserInfo,
} from '@/app/_contexts/_globalContexts/UserInfoContext'
import GoogleAnalytics from '@/app/_features/GoogleAnalytics/GoogleAnalytics'
import AuthGuard from '@/app/_features/auth/AuthGuard'
import { getUsers, getUserCharacters } from '@/app/_features/fetchAPI'
import buildProvidersTree from '@/app/_utils/buildProvidersTree'
import { kiwimaru } from '@/app/_utils/font'

import { Drawer } from './Drawer/layout'
import { Header } from './Header/layout'
import { Information } from './Information/layout'
import { Footer } from './footer/layout'
import { Loading } from './loading/layout'
import { FadeInAnimation } from '../root/FadeInAnimation'
import { OpeningAnimation } from '../root/OpeningAnimation'

// デフォルトではpreloadがtrueになっているのでsubsetsの指定が必要
const inter = Inter({ subsets: ['latin'] })

export type AppLayoutProps = {
  children: React.ReactNode
}

const ProviderTree = buildProvidersTree([
  CharacterListProvider,
  DecisionsProvider,
  DrawerProvider,
  HelperProvider,
  TopPageProvider,
  CharacterProvider,
  GlobalStateProvider,
  UserInfoProvider,
])

const LayoutContent = ({ children }: AppLayoutProps) => {
  const { isViewed, setIsViewed } = useTopPage() // Opening Animation Flag
  const [isAuth, setIsAuth] = useState<string | null>(null) // 認証状態
  const [isAdmin, setIsAdmin] = useState<boolean>(false) // 管理者権限
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState<boolean>(false) // ローディング画面
  const { data: session, status } = useSession()
  const { isModalOpen, setIsModalOpen } = useGlobalState()
  const { isHamburgerClick } = useDrawer()
  const { isClickInformation, setIsClickInformation } = useHelper()
  const { setCurrentUser } = useUserInfo()
  const { userCharacters, setUserCharacters } = useCharacter()
  const { userCharactersList, setUserCharactersList } = useCharacterList()
  const router = useRouter()
  const isRoot = usePathname()
  const unAuthenticatedPaths = [
    '/',
    '/privacy-policy',
    '/terms-of-service',
    '/index',
    '/guest/decisions',
  ]

  useEffect(() => {
    setIsAuth(sessionStorage.getItem('unAuthFlag'))
    // 非認証の状態でルートにアクセスした場合、Openingアニメーションを表示する
    if (isRoot == '/' && status == 'unauthenticated') {
      setIsViewed(false)
    } else if (status == 'authenticated') {
      setIsViewed(true)
    } else if (status == 'unauthenticated' && unAuthenticatedPaths.includes(isRoot)) {
      setIsViewed(true)
    }
    // 認証状態からサインアウトした場合、ルートにリダイレクトする
    if (isRoot != '/' && isAuth == 'true') {
      router.replace('/')
      sessionStorage.removeItem('unAuthFlag')
    }

    if (isRoot == '/admin') {
      setIsAdmin(true)
    } else {
      setIsAdmin(false)
    }

    if (isRoot != '/helper') {
      setIsClickInformation(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, isRoot, isAuth, session, router])

  useEffect(() => {
    // 認証状態になった場合、currentUserとuserCharactersを取得する
    if (status == 'authenticated' && session.appAccessToken) {
      void (async () => {
        const currentUserData = await getUsers(session.appAccessToken, 'current_user')
        if (!userCharacters || !userCharactersList) {
          const userCharactersData = await getUserCharacters(
            session.appAccessToken,
            'user_characters',
          )
          if (userCharactersData) {
            setUserCharacters(userCharactersData.charactersData)
            setUserCharactersList(userCharactersData.user_characters)
          }
        }
        if (currentUserData) {
          setCurrentUser(currentUserData.current_user)
        }
      })()
    }
  }, [status])

  useEffect(() => {
    setIsLoading(false)
    setIsModalOpen(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      className={`relative w-screen min-h-screen ${kiwimaru.className}`}
      data-theme='pastel'
    >
      {/* 背景画像とTopPageアニメーション */}
      <Image
        src='/images/background.png'
        alt='background'
        fill
        className='absolute top-50% left-50% min-w-full min-h-full object-cover z-0'
      />
      {/* オープニングアニメーション */}
      {isRoot == '/' && status != 'loading' && !isViewed && <OpeningAnimation />}
      {isAdmin && children}
      {/* メインコンテンツ */}
      {isViewed && !isAdmin && (
        <div className='flex w-full h-full'>
          {status == 'loading' && <Loading />}
          {status != 'loading' && (
            <FadeInAnimation>
              <div className='flex flex-col w-screen h-full'>
                <div className='flex w-full z-30'>
                  <Header />
                </div>
                <div className='flex flex-row w-full h-full'>
                  {status == 'authenticated' && (
                    <div className='flex h-full z-20'>
                      <Drawer />
                    </div>
                  )}
                  <div
                    className={`flex flex-col grow h-full ${status === 'authenticated' ? (isHamburgerClick ? 'ml-[15rem]' : 'ml-[4rem]') : ''} ${isClickInformation ? 'mr-[30rem]' : ''} mt-[2rem] overflow-x-hidden`}
                  >
                    <main
                      className={`flex w-full min-h-[calc(100vh-4rem)] ${isModalOpen ? 'z-50' : 'z-20'} items-center`}
                    >
                      <AuthGuard>{children}</AuthGuard>
                    </main>
                    <div className='flex z-20'>
                      <Footer />
                    </div>
                  </div>
                  {status == 'authenticated' && isClickInformation && (
                    <div className='flex h-full z-20'>
                      <Information />
                    </div>
                  )}
                </div>
              </div>
            </FadeInAnimation>
          )}
        </div>
      )}
    </div>
  )
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <html lang='ja'>
      <head>
        <GoogleAnalytics />
        <link
          href='https://fonts.googleapis.com/css2?family=Kiwi+Maru:wght@300&display=swap'
          rel='stylesheet'
        />
      </head>

      <body className={inter.className}>
        <SessionProvider>
          <ProviderTree>
            <LayoutContent>{children}</LayoutContent>
          </ProviderTree>
        </SessionProvider>
      </body>
    </html>
  )
}

export default AppLayout
