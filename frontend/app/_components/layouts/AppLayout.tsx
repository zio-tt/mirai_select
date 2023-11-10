"use client"

import { Inter } from 'next/font/google'
import { Suspense } from 'react';
import { SessionProvider } from 'next-auth/react';
import Footer from './footer/layout';
import Header from './header/layout';
import Loading from './loading/layout';

const inter = Inter({ subsets: ['latin'] })

export type AppLayoutProps = {
  children: React.ReactNode
}

export default function AppLayout({children}: AppLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <Suspense fallback={<Loading />}>
            <Header />
            {children}
            <Footer />
          </Suspense>
        </SessionProvider>
      </body>
    </html>
  )
}