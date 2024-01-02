// Components
import { DrawerLogo } from './components/DrawerLogo';
import { DrawerMenu } from './components/DrawerMenu';
import { handleLogin } from '@/app/_features/auth/function';

const PublicDrawer = () => {
  return (
    <>
      {/* LogoSpace */}
      <div id='logo-space'
           className='flex h-[20vh] w-full items-center justify-center'>
        <DrawerLogo />
      </div>
      {/* MenuSpace */}
      <div id='menu-space'
           className='flex h-[80vh] w-full items-start justify-center'>
        <DrawerMenu url='/'
                    text='Google認証'
                    imageURL='/images/google.png'
                    onClick={handleLogin} />
      </div>
    </>
  );
}

export { PublicDrawer };