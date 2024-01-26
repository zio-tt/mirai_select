import Link from "next/link"
import Image from "next/image"
import { Bars3Icon } from "@heroicons/react/24/solid"
import { useDrawer } from "@/app/_contexts/DrawerContext"
import { useDecisions } from "@/app/_contexts/DecisionsContext"
import { useSession } from "next-auth/react"
import { GoogleLoginButton } from "@/app/_components/ui"
import { handleLogout } from "@/app/_features/auth/function"
import { useHelper } from "@/app/_contexts/HelperContext"
import { GuestMenu } from "@/app/_components/guest/GuestMenu"

const Header = () => {
  const { isHamburgerClick, setIsHamburgerClick } = useDrawer();
  const { setDrawerWidth } = useDrawer();
  const { data: session, status } = useSession();
  const { setDecisionsCondition } = useDecisions();
  const { remainingTokens } = useHelper();

  const handleHamburgerClick = () => {
    if (isHamburgerClick) {
      setDrawerWidth('w-[4rem]');
      setIsHamburgerClick(false);
    } else {
      setDrawerWidth('w-[15rem]');
      setIsHamburgerClick(true);
    }
  }

  const handleMenuClick =(
    condition: string
  ) => {
    if (condition === 'logout') {
      handleLogout();
    } else {
      setDecisionsCondition(condition);
    }
  }

  return (
    <div className="fixed navbar min-h-[3rem] border-b bg-[#F4A100]">
      <div className="flex-none">
        { status === 'authenticated' && (
          <div className="btn btn-circle btn-ghost p-2"
              onClick={handleHamburgerClick} >
            <Bars3Icon />
          </div>
        )}
      </div>
      <div className="flex-1 ml-4">
        <Link id='root' href='/'>
          <p className='text-lg text-center'>ミライセレクト</p>
          <p className='text-xs text-center'>あなたの選択をサポートする</p>
        </Link>
      </div>
      <div className="flex-none mr-2">
        { status === 'unauthenticated' && (
          <>
            <GuestMenu />
            <GoogleLoginButton />
          </>
        )}
        { status === 'authenticated' && (
          <>
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-circle btn-ghost">
                <div className="h-full">
                  <Image src={session?.user?.image!}
                        alt={session?.user?.name!}
                        width={100}
                        height={100}
                        className='flex object-cover rounded-full' />
                </div>
              </div>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                <li><Link href='/mypage' onClick={() => handleMenuClick('private')}>保存した決断</Link></li>
                <li><Link href='/mypage' onClick={() => handleMenuClick('favorite')}>お気に入り</Link></li>
                <li><Link href='#'       onClick={() => handleMenuClick('logout')}>ログアウト</Link></li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export { Header }