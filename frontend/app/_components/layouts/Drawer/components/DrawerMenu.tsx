"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useDrawer }           from '@/app/_contexts/DrawerContext';
import { handleLogin }         from '@/app/_features/auth/function';
import { handleLogout }        from '@/app/_features/auth/function';

interface DrawerMenuProps {
  url: string;
  text: string;
  imageURL: string;
}

const DrawerMenu = ({ url, text, imageURL }: DrawerMenuProps) => {
  const [ image, setImage ]    = useState<string>('/images/logo.png');
  const [ urlPath, setUrlPath] = useState<string>('/');
  const { setIsDrawerClick }   = useDrawer();
  const { setDrawerLink }      = useDrawer();

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (url === 'login') {
      handleLogin(e);
    } else if (url === 'logout') {
      handleLogout(e);
    } else {
      setIsDrawerClick(true);
      setDrawerLink(e.currentTarget.id);
    }
  }

  useEffect(() => {
    if (url === 'login' || url === 'logout') {
      setUrlPath('#');
    } else {
      setUrlPath(url);
    }
  }, [])

  const textElements = text.split('¥¥¥').map((item, index, array) => (
    <span key={index}>
      {item}
      {index < array.length - 1 && <br />}
    </span>
  ));

  useEffect(() => {
    if (imageURL) {setImage(imageURL);}
  }, []);

  return (
    <div className='flex flex-row h-[4rem] w-[70%] items-center justify-center mb-[3vh]'>
      <div className="flex h-12 w-10 mr-2 items-center justify-center overflow-hidden">
        <Image src={imageURL} alt={text} width={100} height={100} className='flex object-cover' />
      </div>
      <div className='w-[80%] flex h-[10vh] p-1 border-black border-2 rounded-lg items-center justify-center hover:bg-[#ffcf82]'>
        <Link id={url}
              href={urlPath}
              onClick={handleClick}
              className='text-[0.9rem] font-bold leading-5 mr-3 ml-3 text-center'>
                {textElements}
        </Link>
      </div>
    </div>
  );
}

export { DrawerMenu }