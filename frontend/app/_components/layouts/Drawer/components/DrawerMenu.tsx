/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

import { useDrawer } from '@/app/_contexts/_featureContexts/DrawerContext'
import { handleLogin, handleLogout } from '@/app/_features/auth/function'

interface DrawerMenuProps {
  url: string
  text: string
  imageURL: string
}

const DrawerMenu = ({ url, text, imageURL }: DrawerMenuProps) => {
  const [image, setImage] = useState<string>('/images/logo.png')
  const [urlPath, setUrlPath] = useState<string>('/')
  const { setIsDrawerClick } = useDrawer()
  const { setDrawerLink } = useDrawer()
  const { isHamburgerClick } = useDrawer()

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    void (async () => {
      if (url === 'login') {
        await handleLogin(e)
      } else if (url === 'logout') {
        await handleLogout()
      } else {
        setIsDrawerClick(true)
        setDrawerLink(e.currentTarget.id)
      }
    })()
  }

  useEffect(() => {
    if (url === 'login' || url === 'logout') {
      setUrlPath('#')
    } else {
      setUrlPath(url)
    }
  }, [url])

  const textElements = text.split('¥¥¥').map((item, index, array) => (
    <span key={index}>
      {item}
      {index < array.length - 1 && <br />}
    </span>
  ))

  useEffect(() => {
    if (imageURL) {
      setImage(imageURL)
    }
  }, [imageURL])

  return (
    <>
      <Link
        id={url}
        title={text}
        href={urlPath}
        onClick={handleClick}
        className={`flex ${isHamburgerClick ? 'flex-row' : 'flex-col'} items-center justify-center ml-2 mb-4 p-3 rounded-lg hover:bg-[#ffcf82]`}
      >
        <div
          className={`flex h-6 w-6 items-center justify-center overflow-hidden ${isHamburgerClick ? 'mr-2' : ''}`}
        >
          <Image
            src={imageURL}
            alt={text}
            width={100}
            height={100}
            className='flex object-cover'
          />
        </div>
        <div className={`flex ${isHamburgerClick ? 'text-md' : 'hidden'}`}>
          {textElements}
        </div>
      </Link>
    </>
  )
}

export { DrawerMenu }
