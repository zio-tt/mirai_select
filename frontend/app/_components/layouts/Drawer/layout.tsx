// hooks
import { usePathname } from 'next/navigation';
import { useHelper }   from '@/app/_contexts/HelperContext';
// contexts
import { useDrawer } from '@/app/_contexts/DrawerContext';
// components
import { DrawerMenu } from './components/DrawerMenu';

const Drawer = () => {
  const isRoot = usePathname();
  const { remainingTokens }  = useHelper();
  const { isHamburgerClick } = useDrawer();
  const { drawerWidth } = useDrawer();

  // スマホサイズなどコンテンツが正常に表示されないサイズの場合、
  // ハンバーガーメニューをクリックするまでDrawerを非表示にする
  // ハンバーがーメニューがクリックされた時はdrawerWidthを100%にする
  // つまりメインコンテンツが完全に画面外に押し出されるような形にする
  return (
    <>
      <div className={`fixed flex flex-col ${drawerWidth} min-h-[100%] overflow-auto justify-start ${ isHamburgerClick ? `items-start` : `items-center`} pt-10 mt-[3rem] border-r`}>
        <div id='menu-space'
            className='flex flex-col w-full items-start justify-start'>
          <DrawerMenu url='/helper'
                      imageURL="/images/comment.png"
                      text='決断ヘルパー' />
          <DrawerMenu url='/decisions'
                      imageURL="/images/sns.png"
                      text='みんなの悩みごと' />
          <DrawerMenu url='/mypage'
                      imageURL="/images/human.png"
                      text='マイページ' />
          <DrawerMenu url='logout'
                      imageURL="/images/exit.png"
                      text='ログアウト' />
        </div>
        {isHamburgerClick && isRoot == '/helper' && ( 
          <div className='flex flex-col w-full items-start justify-start border-t pt-6 pl-6'>
            <div className='text-sm underline-offset-4 underline'>残ポイント: <span className="text-lg">{remainingTokens}</span></div>
          </div>
        )}
      </div>
    </>
  );
}

export { Drawer }