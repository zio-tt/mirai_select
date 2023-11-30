"use client";

import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import Loading from '../_components/layouts/loading/layout';

const unAuthenticatedPaths = ['/privacy-policy', '/terms-of-service'];

const AuthGuard = ({ children }: { children: React.ReactNode }): any => {
  const { status } = useSession();
  const router = useRouter();
  const isRoute = usePathname();

  useEffect(() => {
    if ((status === 'unauthenticated' || status === null) && (!unAuthenticatedPaths.includes(isRoute) || isRoute == '/')) {router.replace('/');}
  }, [router, status]);
  if (status === 'loading') return <Loading />;
  if ((status === 'unauthenticated' || status === null) && (unAuthenticatedPaths.includes(isRoute))) { return children };
  if (status === 'authenticated') return children;
};

export default AuthGuard;