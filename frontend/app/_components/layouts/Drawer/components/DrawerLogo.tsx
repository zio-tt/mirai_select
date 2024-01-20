import Link from 'next/link';

const DrawerLogo = ({ url }: { url: string }) => {
  return(
    <div className='flex h-[15vh] w-[70%] border-black border-2 rounded-lg items-center justify-center hover:bg-[#ffcf82]'>
      <Link id={url} href={url}>
        <p className='text-xl text-center'>ミライセレクト</p>
        <p className='text-xs text-center'>あなたの選択をサポートする</p>
      </Link>
    </div>
  );
}

export { DrawerLogo }