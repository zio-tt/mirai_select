import './globals.css'
import AppLayout from './_components/layouts/AppLayout'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ミライセレクト | あなたの選択を助けるアプリ',
  description:
    'ミライセレクトはあなたの選択を助けるアプリです。AIがあなたの悩み事に対して2つの選択肢を提示します。',
  openGraph: {
    title: 'ミライセレクト',
    description:
      'ミライセレクトはあなたの選択を助けるアプリです。AIがあなたの悩み事に対して2つの選択肢を提示します。',
    url: 'https://mirai-select.net/',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ミライセレクト',
    description:
      'ミライセレクトはあなたの選択を助けるアプリです。AIがあなたの悩み事に対して2つの選択肢を提示します。',
  },
}

export const dynamic = 'force-dynamic'

export default AppLayout
