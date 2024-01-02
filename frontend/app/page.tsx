'use client'

import { ContentsCard } from './_components/ui/TopPage/ContentsCard';

export default function Home() {

  return (
    <>
      <div className='flex flex-col w-full min-h-screen items-center justify-start overflow-auto mt-16'>
        <div className='flex flex-col items-center justify-start w-full h-full'>
          <div className='flex flex-col items-center justify-start w-[90%]'>
            <ContentsCard
              imageURL={['/images/top/worried-woman.png']}
              imageAlt={['worried']}
              addClassName={'absolute min-w-full min-h-full object-cover opacity-80'}
              imageWidth={undefined}
              imageHeight={undefined}
              title={'悩みごと、ありませんか？'}
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
              imageURL={['/images/top/devil.png','/images/top/angel.png']}
              imageAlt={['devil', 'angel']}
              addClassName={''}
              imageWidth={200}
              imageHeight={200}
              title={'私たちがサポートします。'}
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
              imageURL={['/images/top/inspiration-girl-1.png']}
              imageAlt={['inspiration']}
              addClassName={'absolute min-w-full min-h-full object-cover opacity-80'}
              imageWidth={undefined}
              imageHeight={undefined}
              title={'気づきを得る。'}
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
        </div>
      </div>
    </>
  );
}