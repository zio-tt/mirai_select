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
      </div>
    </>
  );
}

export { Drawer }