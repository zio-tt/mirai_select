import Link from "next/link"
import { Bars3Icon } from "@heroicons/react/24/solid"
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid"
import { useDrawer } from "@/app/_contexts/DrawerContext"

const Header = () => {
  const { isHamburgerClick, setIsHamburgerClick } = useDrawer();

  const handleHamburgerClick = () => {
    setIsHamburgerClick(!isHamburgerClick);
  }

  console.log(isHamburgerClick);

  return (
    <div className="navbar bg-base-100 min-h-[3rem] z-20">
      <div className="flex-none">
        <button className="btn btn-square btn-ghost"
                onClick={handleHamburgerClick} >
          <Bars3Icon />
        </button>
      </div>
      <div className="flex-1 ml-4">
        <Link id='root' href='/'>
          <p className='text-lg text-center'>ミライセレクト</p>
          <p className='text-xs text-center'>あなたの選択をサポートする</p>
        </Link>
      </div>
      <div className="flex-none">
        <button className="btn btn-square btn-ghost">
          <EllipsisVerticalIcon />
        </button>
      </div>
    </div>
  )
}

export { Header }