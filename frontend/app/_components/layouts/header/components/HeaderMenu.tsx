import Link from 'next/link';

interface HeaderMenuProps {
  url: string;
  text: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}

export const HeaderMenu = ({ url, text, onClick }: HeaderMenuProps) => {
  return (
    <Link href={url} onClick={onClick} className='text-base hover:underline mr-3 ml-3'>{text}</Link>
  )
}