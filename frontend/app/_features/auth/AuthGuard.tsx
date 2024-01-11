'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
const unAuthenticatedPaths = ['/', '/privacy-policy', '/terms-of-service', '/index'];

const AuthGuard = ({ children }: { children: React.ReactNode }): any => {
  const { status } = useSession();
  const router = useRouter();
  const isRoute = usePathname();

  {/* 非認証状態で認可されていないページにアクセスした場合 */}
  useEffect(() => {
    if ((status === 'unauthenticated') && (!unAuthenticatedPaths.includes(isRoute)))
        { router.replace('/'); }
  }, [router, status]);

  {/* 非認証状態で認可されているページにアクセスした場合 */}
  if ((status === 'unauthenticated' || status === null) && (unAuthenticatedPaths.includes(isRoute)))
      { return children; };
  {/* 認証状態でページにアクセスした場合 */}
  if (status === 'authenticated') return children;
};

export default AuthGuard;