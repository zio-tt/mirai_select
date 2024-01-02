import { useSession } from 'next-auth/react';
import { PrivateDrawer } from './private';
import { PublicDrawer } from './public';

const Drawer = () => {
  const { status } = useSession();

  return (
    <div className='fixed flex flex-col w-[20vw] h-screen overflow-hidden justify-center bg-[#fcd9d9] z-20' data-theme='fantasy'>
      {status === 'authenticated' ? <PrivateDrawer /> : <PublicDrawer />}
    </div>
  );
}

export { Drawer }