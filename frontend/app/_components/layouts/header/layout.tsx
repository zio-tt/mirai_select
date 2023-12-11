import PublicHeader from './public';
import PrivateHeader from './private';
import { useSession } from 'next-auth/react';

const Header = () => {
  const { status } = useSession();

  return (
    <header className='flex fixed h-16 w-screen items-center justify-center' data-theme="dark">
      {status === 'authenticated' ? <PrivateHeader /> : <PublicHeader />}
    </header>
  );
}

export default Header;