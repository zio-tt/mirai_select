import { signIn } from 'next-auth/react';

export const handleLogin = async (e: React.MouseEvent<HTMLElement>) => {
  e.preventDefault();
  try {
    await signIn('google', { redirect: false });
  } catch (error) {
    console.error(error);
  }
}