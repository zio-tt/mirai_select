// Hooks
import { usePathname } from 'next/navigation';
import { useHelper }   from '@/app/_contexts/HelperContext';
// Components
import { DrawerLogo }       from './components/DrawerLogo';
import { DrawerMenu }       from './components/DrawerMenu';

const PrivateDrawer = () => {
  const { remainingTokens }  = useHelper();
  const isRoot = usePathname();

  return (
    <>
      <div id='logo-space'
          className='flex h-[20vh] w-full items-center justify-center'>
        <DrawerLogo url='/' />
      </div>
      <div id='menu-space'
           className='flex flex-col h-[60vh] w-full items-center justify-start'>
        <div className="divider divider-neutral mb-6">Menu</div>
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
      <div className="information flex flex-col min-h-[20vh] items-center justify-start">
        <div className="divider divider-neutral">Information</div>
        {isRoot === '/helper' && (
          <p className='flex font-bold underline underline-offset-2'>残トークン：{remainingTokens}</p>
        )}
      </div>
    </>
  );
}

export { PrivateDrawer };