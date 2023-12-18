import Link from 'next/link';

interface FooterMenuProps {
  url: string;
  text: string;
}

const FooterMenu = ({url, text}: FooterMenuProps) => {
  return (
    <Link href={url} className='flex link link-hover mx-2'>{text}</Link>
  )
}

const Footer = () => {
  return (
    <footer className='footer footer-center flex h-16 w-screen items-center justify-center z-10 p-5 bg-base-200 text-base-content rounded' data-theme='dark'>
      <nav className='flex flex-row'>
        <FooterMenu url='https://forms.gle/5529xgmL49n93grn9' text='お問い合わせ' />
        <FooterMenu url='/privacy-policy' text='プライバシーポリシー' />
        <FooterMenu url='/terms-of-service' text='利用規約' />
      </nav>
    </footer>
  );
}

export default Footer;