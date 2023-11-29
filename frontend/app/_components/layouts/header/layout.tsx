import PublicHeader from './public';
import PrivateHeader from './private';
import { useSession } from 'next-auth/react';

export default function Header() {
  const { status } = useSession();

  return (
    <header className='flex fixed h-16 w-screen items-center justify-center z-20' data-theme="dark">
      {status === 'authenticated' ? <PrivateHeader /> : <PublicHeader />}
    </header>
  );
}