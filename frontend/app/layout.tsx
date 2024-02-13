import './globals.css'
import AppLayout from './_components/layouts/AppLayout'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://mirai-select.net/'),
  title: 'ミライセレクト | あなたの選択を助けるアプリ',
  description:
    'ミライセレクトはあなたの選択を助けるアプリです。AIがあなたの悩み事に対して2つの選択肢を提示します。',
  openGraph: {
    title: 'ミライセレクト | あなたの選択を助けるアプリ',
    description:
      'ミライセレクトはあなたの選択を助けるアプリです。AIがあなたの悩み事に対して2つの選択肢を提示します。',
  },
  twitter: {
    title: 'ミライセレクト | あなたの選択を助けるアプリ',
    description:
      'ミライセレクトはあなたの選択を助けるアプリです。AIがあなたの悩み事に対して2つの選択肢を提示します。',
    card: 'summary_large_image',
  },
}

export const dynamic = 'force-dynamic'

export default AppLayout
