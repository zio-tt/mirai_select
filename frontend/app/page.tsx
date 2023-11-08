"use client"

import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleLoginButton} from '@/app/_components/ui-elements';

export default function Home() {
  const [showLogo, setShowLogo] = useState(true);
  const [showButton, setShowButton] = useState(false);
  const [logoOpacity, setLogoOpacity] = useState(0);
  const [buttonOpacity, setButtonOpacity] = useState(0);
  const [currentUser , setCurrentUser ] = useState('');
  const { data: session, status } = useSession();
  const router = useRouter();

  const VisitAnimate = () => {
    const fadeInLogoTimer = setTimeout(() => {
      setLogoOpacity(1);
    }, 1000);

    const fadeOutLogoTimer = setTimeout(() => {
      setLogoOpacity(0);
    }, 2000);

    const ShowButtonTimer = setTimeout(() => {
      setShowButton(true);
    }, 2001);

    const fadeInButtonTimer = setTimeout(() => {
      setShowLogo(false);
      setButtonOpacity(1);
    }, 3000);

    const setSessionCurrentUser = setTimeout(() => {
      if (status == 'authenticated') { sessionStorage.setItem('currentUser', session.user.id)}
    }, 3001);

    return () => {
      clearTimeout(fadeInLogoTimer);
      clearTimeout(fadeOutLogoTimer);
      clearTimeout(ShowButtonTimer);
      clearTimeout(fadeInButtonTimer);
      clearTimeout(setSessionCurrentUser);
    };
  }

  useEffect(() => {
    let user = sessionStorage.getItem('currentUser');
    if (user == null) { user = '' };
    console.log(user);
    setCurrentUser(user);
    if (user == '') {
      VisitAnimate();
    } else {
      setShowButton(false);
      setShowLogo(false);
      setButtonOpacity(1);
    }

    return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status]);

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div
          className={'transform transition-opacity duration-1000'}
          style={{ display: showButton ? 'none' : 'block', opacity: logoOpacity }}
        >
          {showLogo && (
            <Image src="/images/logo_image.png" alt="Logo" width={500} height={500} style = {{ objectFit: "contain" }} />
          )}
        </div>
        { showButton && (
          <div className="transition-opacity duration-1000" style={{ opacity: buttonOpacity }}>
            <GoogleLoginButton />
          </div>
        )}
        {session && status == 'authenticated' && (
          <div className="flex flex-col items-center justify-center">
            <p>ID: {session.user.id}</p>
            <p>Name: {session.user.name}</p>
            <p>Email: {session.user.email}</p>
            <p>Provider: {session.user.provider}</p>
          </div>
        )}
      </div>
    </>
  );
}