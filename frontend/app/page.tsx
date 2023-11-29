"use client"

import Image from 'next/image';
import { kiwimaru } from './_components/layouts/AppLayout';
import { useState, MouseEvent, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from './_components/layouts/header/layout';
import Footer from './_components/layouts/footer/layout';
import { useTopPage } from './_features/top/TopPageContext';

export default function Home() {
  const { isViewing, setIsViewing } = useTopPage();
  const { isViewed, setIsViewed } = useTopPage();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  useEffect(() => {
    const movingTimer = setTimeout(() => {
      setIsViewing(true);
    }, 1000);
    const movedTimer = setTimeout(() => {
      setIsViewed(true);
    }, 2000);
    return () => {
      clearTimeout(movingTimer);
      clearTimeout(movedTimer);
    };
  }, []);

  return (
    <>
    <div className='flex flex-col w-screen h-screen z-10 relative overflow-auto'>
      { !isViewed && (
        <div className='flex w-screen h-screen z-10 relative'>
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
          <div className='flex flex-col w-full h-full items-center justify-start mt-[17vh]'>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className='flex flex-col items-center justify-start w-full h-full'>
              <div className='flex flex-col items-center justify-start w-[90%] h-[75%]'>
                <div className='flex flex-col lg:flex-row items-center justify-center w-full mb-10'>
                  <div className='relative w-[30vw] min-h-[40vh] overflow-hidden left-0 mr-5'>
                    <Image src="/images/top/worried-woman.png"
                            alt="worried"
                            layout='fill'
                            className='absolute min-w-full min-h-full object-cover opacity-80' />
                  </div>
                  <div className='flex flex-col items-center justify-center right-0 ml-5
                                  w-[40vw] min-h-[40vh]'>
                    <div className="h-full w-full bg-gray-200/30 backdrop-blur-lg
                      rounded-md border border-gray-200/30 shadow-lg
                      flex flex-col items-center justify-center p-10">
                      <h3 className='flex text-gray-500 text-lg md:text-2xl lg:text-4xl'>悩みごと、ありませんか？</h3>
                      <p className='flex text-gray-500 text-xs md:text-md lg:text-lg mt-2'>
                        「今度の休みはどこにいこうかな？」<br/>
                        「ボーナスの使い道、どうしよう？」<br/>
                        「将来の進路、決められない…」<br/>
                        <br/>
                        日常はさまざまな悩みにあふれています。<br/>
                        いろんな情報があふれているからこそ、<br/>
                        何かを決めるのは難しいものです。<br/>
                      </p>
                    </div>
                  </div>
                </div>
                <div className='flex flex-col lg:flex-row items-center justify-center w-full mb-10'>
                  <div className='flex items-center justify-center w-[30vw] min-h-[40vh] overflow-hidden left-0 mr-5'>
                    <div className='flex flex-row w-full h-full items-center justify-center'>
                      <div className='flex items-center justify-center left-0'>
                        <Image src="/images/top/devil.png"
                              alt="devil"
                              width={200}
                              height={200}
                              className='opacity-80'/>
                        </div>
                      <div className='flex items-center justify-center right-0'>
                        <Image src="/images/top/angel.png"
                              alt="angel"
                              width={200}
                              height={200}
                              className='opacity-80'/>
                      </div>
                    </div>
                  </div>
                  <div className='flex flex-col items-center justify-center right-0 ml-5
                                  w-[40vw] min-h-[40vh]'>
                    <div className="h-full w-full bg-gray-200/30 backdrop-blur-lg
                      rounded-md border border-gray-200/30 shadow-lg
                      flex flex-col items-center justify-center p-10">
                      <h3 className='flex text-gray-500 text-lg md:text-2xl lg:text-4xl'>私たちがサポートします。</h3>
                      <p className='flex text-center text-gray-500 text-xs md:text-md lg:text-lg mt-2'>
                        漫画やアニメでよく見かける、<br/>
                        天使と悪魔の脳内会議。<br/>
                        2人のキャラクターがそれぞれの視点に立って、<br/>
                        あなたにとってより良い選択をサポートします。<br/>
                        ※ 今後、キャラクターカスタマイズ機能を追加予定！<br/>
                      </p>
                    </div>
                  </div>
                </div>
                <div className='flex flex-col lg:flex-row items-center justify-center w-full mb-10'>
                  <div className='relative w-[30vw] min-h-[40vh] overflow-hidden left-0 mr-5'>
                    <Image src="/images/top/inspiration-girl-1.png"
                            alt="inspiration"
                            layout='fill'
                            className='absolute min-w-full min-h-full object-cover opacity-80' />
                  </div>
                  <div className='flex flex-col items-center justify-center right-0 ml-5
                                  w-[40vw] min-h-[40vh]'>
                    <div className="h-full w-full bg-gray-200/30 backdrop-blur-lg
                      rounded-md border border-gray-200/30 shadow-lg
                      flex flex-col items-center justify-center p-10">
                      <h3 className='flex text-gray-500 text-lg md:text-2xl lg:text-4xl'>気づきを得る</h3>
                      <p className='flex text-center text-gray-500 text-xs md:text-md lg:text-lg mt-2'>
                        「決断ヘルパー」で悩みごとを解決するもよし。<br/>
                        「みんなの悩みごと」で他人の悩みごとを見るのもよし。<br/>
                        <br/>
                        さまざまな視点・方法で気づきを得て、<br/>
                        自分の決断に役立ててください。<br/>
                      </p>
                    </div>
                  </div>
                </div>
                <Footer />
              </div>
            </motion.div>
          </div>
        </>
      )}
      </div>
    </>
  );
}