// Components
import { DrawerLogo } from './components/DrawerLogo';
import { DrawerMenu } from './components/DrawerMenu';
import { handleLogin } from '@/app/_features/auth/function';

const PublicDrawer = () => {
  return (
    <>
      <div id='logo-space'
          className='flex h-[20vh] w-full items-center justify-center'>
        <DrawerLogo url="/" />
      </div>
      <div id='menu-space'
           className='flex flex-col h-[60vh] w-full items-center justify-start'>
        <div className="divider divider-neutral mb-6">Menu</div>
        <DrawerMenu url='login'
                    text='Google認証'
                    imageURL='/images/google.png'/>
        <DrawerMenu url='#'
                    text='体験ページ¥¥¥（現在準備中）'
                    imageURL='/images/wakaba.png'/>
      </div>
      <div className="information flex flex-col min-h-[20vh] items-center justify-start">
        <div className="divider divider-neutral">Information</div>
      </div>
    </>
  );
}

export { PublicDrawer };