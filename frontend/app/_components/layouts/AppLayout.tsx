"use client"

import { Inter } from 'next/font/google'
import { SessionProvider } from 'next-auth/react';
import Footer from './footer/layout';
import React from "react";

const inter = Inter({ subsets: ['latin'] })

export type AppLayoutProps = {
  children: React.ReactNode
}

export default function AppLayout({children}: AppLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          {children}
          <Footer />
        </SessionProvider>
      </body>
    </html>
  )
}