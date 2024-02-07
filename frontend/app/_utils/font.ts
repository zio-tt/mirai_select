import { Noto_Sans_JP, Kiwi_Maru } from 'next/font/google'

export const notojp = Noto_Sans_JP({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export const kiwimaru = Kiwi_Maru({
  weight: '300',
  subsets: ['latin'],
  display: 'swap',
})
