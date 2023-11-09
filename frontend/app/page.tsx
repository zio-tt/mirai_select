"use client"

import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleLoginButton} from '@/app/_components/ui-elements';
import { logger } from '@/app/_common/utils/logger'

export default function Home() {
  const [showLogo, setShowLogo] = useState(true);
  const [showButton, setShowButton] = useState(false);
  const [logoOpacity, setLogoOpacity] = useState(0);
  const [buttonOpacity, setButtonOpacity] = useState(0);
  const [showContent , setShowContent ] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  const VisitAnimate = () => {
    const fadeInLogoTimer = setTimeout(() => {
      setLogoOpacity(1);
    }, 500);

    const fadeOutLogoTimer = setTimeout(() => {
      setLogoOpacity(0);
    }, 1500);

    const ShowButtonTimer = setTimeout(() => {
      setShowLogo(false);
      setShowButton(true);
    }, 2000);

    const fadeInButtonTimer = setTimeout(() => {
      setButtonOpacity(1);
      sessionStorage.setItem('hasVisited', 'visited');
    }, 2500);

    return () => {
      clearTimeout(fadeInLogoTimer);
      clearTimeout(fadeOutLogoTimer);
      clearTimeout(ShowButtonTimer);
      clearTimeout(fadeInButtonTimer);
    };
  }

  useEffect(() => {
    logger.log(session?.user.image)
    let hasVisited = sessionStorage.getItem('hasVisited');
    if (hasVisited == null && status == 'unauthenticated') {
      VisitAnimate();
    } else if (hasVisited && status == 'unauthenticated') {
      setShowButton(true);
      setShowLogo(false);
      setButtonOpacity(1);
    } else if (status == 'authenticated') {
      setShowButton(false);
      setShowLogo(false);
      setShowContent(true);
    }

    return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status]);

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div
          className={'transform transition-opacity duration-1000'}
          style={{ display: showLogo ? 'block' : 'none', opacity: logoOpacity }}
        >
          {showLogo && (
            <Image src="/images/logo_image.png" alt="Logo" width={500} height={500} style = {{ objectFit: "contain" }} />
          )}
        </div>
        { showButton && (
          <div
            className="transition-opacity duration-1000"
            style={{ display: showButton ? 'block' : 'none', opacity: buttonOpacity }}>
            <GoogleLoginButton />
          </div>
        )}
        { showContent && (
          <div>
            <h1>ログイン済み</h1>
          </div>
        )}
      </div>
    </>
  );
}