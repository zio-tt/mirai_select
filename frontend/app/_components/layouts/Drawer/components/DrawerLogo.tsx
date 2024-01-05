import Link from 'next/link';

const DrawerLogo = () => {
  return(
    <div className='flex h-[15vh] w-[70%] border-black border-2 rounded-lg items-center justify-center hover:bg-[#ffcf82]'>
      <Link href='/'>
        <p className='text-xl text-center'>ミライセレクト</p>
        <p className='text-xs text-center'>あなたの選択をサポートする</p>
      </Link>
    </div>
  );
}

export { DrawerLogo }