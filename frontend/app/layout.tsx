import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Footer from './_components/layouts/footer/layout';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ミライセレクト | あなたの選択を助けるアプリ',
  description: 'ミライセレクトはあなたの選択を助けるアプリです。AIがあなたの悩み事に対して2つの選択肢を提示します。',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Footer />
      </body>
    </html>
  )
}
