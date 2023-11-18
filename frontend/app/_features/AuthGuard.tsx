import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React, { useEffect } from 'react';
import Loading from '../_components/layouts/loading/layout';

const AuthGuard = ({ children }: { children: React.ReactNode }): any => {
  const { status } = useSession();
  const router = useRouter();
  const unAuthenticatedPath = usePathname();
  useEffect(() => {
    if ((status === 'unauthenticated' || status === null) && ( unAuthenticatedPath != '/privacy-policy' && unAuthenticatedPath != '/terms-of-service' && unAuthenticatedPath != '/about'))
      router.replace('/');
  }, [router, status]);
  if (status === 'loading') return <Loading />;
  if ((status === 'unauthenticated' || status === null) && ( unAuthenticatedPath == '/privacy-policy' || unAuthenticatedPath == '/terms-of-service' || unAuthenticatedPath == '/about')) { return children };
  if (status === 'authenticated') return children;
};

export default AuthGuard;