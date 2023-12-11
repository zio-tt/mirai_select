// Components
import { HeaderLogo } from './components/HeaderLogo';
import { HeaderMenu } from './components/HeaderMenu';
import { handleLogin } from '@/app/_features/auth/function';

const PublicHeader = () => {
  return (
    <>
      <HeaderLogo />
      <div className='fixed right-4 mr-16'>
        <HeaderMenu url='/' text='Google認証' onClick={handleLogin} />
      </div>
    </>
  );
}

export default PublicHeader;