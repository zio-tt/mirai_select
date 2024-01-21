import { useState, createContext, useContext } from 'react';
import { User, Character } from '@/app/_types'; 
import { useHelperInitData } from '../_hooks/_helper/useHelperInitData';

type HelperContextType = {
  currentUser: User | undefined;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | undefined>>;
  userCharacters: Character[] | undefined;
  setUserCharacters: React.Dispatch<React.SetStateAction<Character[] | undefined>>;
  inputText: string;
  setInputText: React.Dispatch<React.SetStateAction<string>>;
  remainingTokens: number;
  setRemainingTokens: React.Dispatch<React.SetStateAction<number>>;
  fetchHelperInitData: (token: string) => Promise<void>;
};

type ChildrenType = {
  children: React.ReactNode;
};

const HelperContext = createContext<HelperContextType | null>(null);

export const useHelper = () => {
  const context = useContext(HelperContext);
  if (!context) {
    throw new Error('useHelper must be used within a HelperProvider');
  }
  return context;
};

export const HelperProvider = ({ children }: ChildrenType) => {
  const { currentUser, setCurrentUser } = useHelperInitData();
  const { userCharacters, setUserCharacters } = useHelperInitData();
  const [ inputText, setInputText ] = useState<string>('');
  const [ remainingTokens, setRemainingTokens ] = useState<number>(0);
  const { fetchHelperInitData } = useHelperInitData();

  return (
    <HelperContext.Provider 
      value={{ currentUser, setCurrentUser,
               userCharacters, setUserCharacters,
               inputText, setInputText,
               remainingTokens, setRemainingTokens,
               fetchHelperInitData}}>
      {children}
    </HelperContext.Provider>
  );
};
