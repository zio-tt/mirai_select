import Link from 'next/link';

interface FooterMenuProps {
  url: string;
  text: string;
}

const FooterMenu = ({url, text}: FooterMenuProps) => {
  return (
    <Link href={url} className='link link-hover'>{text}</Link>
  )
}

const Footer = () => {
  return (
    <div className='flex h-full w-screen items-center justify-center' data-theme='dark'>
      <footer className='footer footer-center p-5 bg-base-200 text-base-content rounded'>
        <nav className='grid grid-flow-col gap-4'>
          <FooterMenu url='https://forms.gle/5529xgmL49n93grn9' text='お問い合わせ' />
          <FooterMenu url='/privacy-policy' text='プライバシーポリシー' />
          <FooterMenu url='/terms-of-service' text='利用規約' />
        </nav>
      </footer>
    </div>
  );
}

export default Footer;