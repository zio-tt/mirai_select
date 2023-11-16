import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import Loading from "../_components/layouts/loading/layout";

const AuthGuard = ({ children }: { children: React.ReactNode }): any => {
  // status には、authenticated・unauthenticated・loading のいずれかが格納されます
  const { status } = useSession();
  const router = useRouter();
  const unAuthenticatedPath = usePathname();
  useEffect(() => {
    if (status === "unauthenticated" || status === null && ( unAuthenticatedPath != "/privacy-policy" || "/terms-of/service"))
      router.replace("/");
  }, [router, status]);
  if (status === "loading") return <Loading />;
  if (status === "authenticated") return children;
};

export default AuthGuard;