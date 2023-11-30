"use client"

import Image from 'next/image';
import { kiwimaru } from './_components/layouts/AppLayout';
import { useState, MouseEvent, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from './_components/layouts/header/layout';
import Footer from './_components/layouts/footer/layout';
import { useTopPage } from './_features/top/TopPageContext';
import { ContentsCard } from './_components/ui-parts/TopPage/ContentsCard';

export default function Home() {
  const [ showTitle, setShowTitle ] = useState<string>("display: block;");
  const [ showContents, setShowContents ] = useState<string>("display: none;");
  const { isViewing, setIsViewing } = useTopPage();
  const { isViewed, setIsViewed } = useTopPage();
  const { isAuthenticated, setIsAuthenticated } = useTopPage();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  useEffect(() => {
    setIsAuthenticated(sessionStorage.getItem('isAuthenticated') === 'true');
    if (!isViewed) {
      const movingTimer = setTimeout(() => {
        setIsViewing(true);
      }, 1000);
      const movedTimer = setTimeout(() => {
        setShowTitle("display: none;");
        setShowContents("display: block;");
        setIsViewed(true);
        sessionStorage.setItem('isTopPageAnimationViewed', 'true');
      }, 2000);
      return () => {
        clearTimeout(movingTimer);
        clearTimeout(movedTimer);
      };
    }
  }, []);

  return (
    <>
    <div className='flex flex-col w-screen min-h-screen relative'>
      { !isViewed && !isAuthenticated && (
        <div className={`flex w-screen h-screen relative overflow-none ${showTitle}`}>
          <motion.div
            initial="hidden"
            animate={isViewing ? "hidden" : "visible"}
            variants={containerVariants}
            className='flex flex-col items-center justify-center w-full h-full absolute'
          >
            <h1 className={`${kiwimaru.className} text-gray-300 text-3xl md:text-5xl lg:text-7xl`}>ミライセレクト</h1>
            <h2 className={`${kiwimaru.className} text-gray-500 text-lg md:text-2xl lg:text-4xl mt-3`}>あなたの決断をサポートする</h2>
          </motion.div>
        </div>
      )}

      {isViewed && (
        <>
          <div className={`flex flex-col w-full h-full items-center justify-start overflow-auto mt-16 ${showContents}`}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className='flex flex-col items-center justify-start w-full h-full'>
              <div className='flex flex-col items-center justify-start w-[90%]'>
                <ContentsCard
                  imageURL={["/images/top/worried-woman.png"]}
                  imageAlt={["worried"]}
                  addClassName={"absolute min-w-full min-h-full object-cover opacity-80"}
                  imageWidth={undefined}
                  imageHeight={undefined}
                  title={"悩みごと、ありませんか？"}
                  text={(
                    <>
                      「今度の休みはどこにいこうかな？」<br/>
                      「ボーナスの使い道、どうしよう？」<br/>
                      「将来の進路、決められない…」<br/>
                      <br/>
                      日常はさまざまな悩みにあふれています。<br/>
                      いろんな情報があふれているからこそ、<br/>
                      何かを決めるのは難しいものです。<br/>
                    </>
                  )}
                />
                <ContentsCard
                  imageURL={["/images/top/devil.png","/images/top/angel.png"]}
                  imageAlt={["devil", "angel"]}
                  addClassName={""}
                  imageWidth={200}
                  imageHeight={200}
                  title={"私たちがサポートします。"}
                  text={(
                    <>
                      漫画やアニメでよく見かける、<br/>
                      天使と悪魔の脳内会議。<br/>
                      2人のキャラクターがそれぞれの視点に立って、<br/>
                      あなたにとってより良い選択をサポートします。<br/>
                      ※ 今後、キャラクターカスタマイズ機能を追加予定！<br/>
                    </>
                  )}
                />
                <ContentsCard
                  imageURL={["/images/top/inspiration-girl-1.png"]}
                  imageAlt={["inspiration"]}
                  addClassName={"absolute min-w-full min-h-full object-cover opacity-80"}
                  imageWidth={undefined}
                  imageHeight={undefined}
                  title={"気づきを得る。"}
                  text={(
                    <>
                      「決断ヘルパー」で悩みごとを解決するもよし。<br/>
                      「みんなの悩みごと」で他人の悩みごとを見るのもよし。<br/>
                      <br/>
                      さまざまな視点・方法で気づきを得て、<br/>
                      自分の決断に役立ててください。<br/>
                    </>
                  )}
                />
              </div>
            </motion.div>
          </div>
        </>
      )}
      </div>
    </>
  );
}