import Link from "next/link"
import { useState, useEffect } from "react"
import { HomeIcon } from "@heroicons/react/24/outline";
import { HomeIcon as HomeIconSolid } from "@heroicons/react/24/solid";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { usePathname } from "next/navigation";

const MyPageMenu = () => {
  const [decisionsCondition, setDecisionsCondition] = useState('private');
  const isRoute = usePathname();

  useEffect(() => {
    if (isRoute == '/mypage/private') {
      setDecisionsCondition('private');
    } else if (isRoute == '/mypage/favorite') {
      setDecisionsCondition('favorite');
    }
  }, [])

  return (
    <div className="w-[70vw] h-[5vh] flex justify-start">
      <Link href='/mypage/private'>
        {decisionsCondition === 'private' ? <HomeIconSolid className="h-full px-4 py-2" /> : <HomeIcon className='h-full px-4 py-2' />}
      </Link>
      <Link href='/mypage/favorite'>
        {decisionsCondition === 'favorite' ? <HeartIconSolid className="h-full px-4 py-2" /> : <HeartIcon className='h-full px-4 py-2' />}
      </Link>
    </div>
  );
}

export { MyPageMenu }