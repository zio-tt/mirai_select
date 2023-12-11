import { signIn } from "next-auth/react";

const handleLogin = async (e: React.MouseEvent<HTMLElement>) => {
  e.preventDefault();
  try {
    await signIn('google', { redirect: false });
  } catch (error) {
    console.error(error);
  }
}

export default handleLogin;