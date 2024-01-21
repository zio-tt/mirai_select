import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getUserCharacters, getUsers } from '@/app/_features/fetchAPI';
import { Character, User } from '@/app/_types';

export const useHelperInitData = () => {
  const { data: session } = useSession();

  const [userCharacters, setUserCharacters]  = useState<Character[]>();
  const [token,          setToken]           = useState<string>('');
  const [isLoading,      setIsLoading]       = useState<boolean>(false);
  const [currentUser,    setCurrentUser]     = useState<User>();

  useEffect(() => {
    if (session) {
      setToken(session.appAccessToken);
    }
  }, [session]);

  useEffect(() => {
    fetchHelperInitData();
  }, [token]);

  const fetchHelperInitData = async () => {
    if (token) {
      setIsLoading(true);
      try {
        const userCharactersData = await getUserCharacters(token, "user");
        const userData           = await getUsers(token, "current_user");
        setUserCharacters(userCharactersData.charactersData);
        setCurrentUser(userData.current_user);
      } catch (error) {
        console.error('Error fetching initial data', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return { 
    userCharacters, setUserCharacters,
    currentUser, setCurrentUser,
    token,
    isLoading,
    fetchHelperInitData };
};