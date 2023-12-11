import Link from 'next/link';

export const HeaderLogo = () => {
  return(
    <div className='fixed left-4 justify-center ml-16'>
      <Link href='/'>
        <p className='text-xl ml-2'>ミライセレクト</p>
        <p className='text-xs'>あなたの選択をサポートする</p>
      </Link>
    </div>
  );
}