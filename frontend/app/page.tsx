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
    logger.log(status);
    logger.log(session?.user)
    let hasVisited = sessionStorage.getItem('hasVisited');
    if (hasVisited == null && (status == 'unauthenticated' || status == null)) {
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
      { !showContent && (
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
        </div>
      )}
      { showContent && (
        <div className="flex flex-col items-center justify-start min-h-screen bg-white">
          <div className='w-[70%]'>
            <div className="flex items-center gap-8 p-4 flex-grow mx-10 my-4">
              {/* キャラクターアイコン */}
              <div className="w-36 h-36 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
              {/* ここにimgタグでキャラクターの画像を入れます */}
                <Image src="/images/character_angel.png" alt="Character" width={144} height={144} className="object-cover" />
              </div>

              {/* セリフ枠 */}
              <div className="flex flex-col gap-2 grow">
              {/* セリフ1 */}
                <div className="p-10 text-xl items-center justify-center bg-white border border-black text-black rounded-lg w-full min-h-[200px]">
                  <div>
                    "ミライセレクト"にお越しいただき、誠にありがとうございます。<br />
                    このWEBアプリは、あなたの抱える悩みや問題に対して、異なる二つの視点からアドバイスを提供します。<br />
                    私たち、天使と悪魔があなたの選択をサポートし、より良い決断へと導きます。<br />
                    あなたの内なる声と対話し、さまざまな選択肢を探求してみましょう。
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-8 p-4 mx-10 my-4">
              {/* セリフ枠 */}
              <div className="flex flex-col gap-2 flex-grow">
              {/* セリフ1 */}
                <div className="p-10 text-xl flex items-center justify-start bg-white border border-black text-black rounded-lg w-full min-h-[200px]">
                  <div>
                    オレ様がこのアプリに備わってる機能の説明をしてやるぜ！<br />
                    "決断ヘルパー"では、AIがオマエの直感を刺激する選択肢を提示するぜ。<br />
                    また、"みんなの悩みごと"機能では、他のユーザーたちの生々しい悩みも覗ける。<br />
                    さぁ、なんでも遠慮なく相談してみな？
                  </div>
                </div>
              </div>
              {/* キャラクターアイコン */}
              <div className="w-36 h-36 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
              {/* ここにimgタグでキャラクターの画像を入れます */}
                <Image src="/images/character_akuma.png" alt="Character" width={144} height={144} className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}