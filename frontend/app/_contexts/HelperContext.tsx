import { useState, createContext, useContext } from 'react';
import { Character } from '@/app/_types'; 

interface User {
  id: number;
  name: string;
  token: number;
  avatar: string;
}

interface CharacterProps extends Character {
  avatar: string;
}

type HelperContextType = {
  userData: User | null;
  setUserData: React.Dispatch<React.SetStateAction<User | null>>;
  characterData: CharacterProps[] | null;
  setCharacterData: React.Dispatch<React.SetStateAction<CharacterProps[] | null>>;
  inputText: string;
  setInputText: React.Dispatch<React.SetStateAction<string>>;
  remainingTokens: number;
  setRemainingTokens: React.Dispatch<React.SetStateAction<number>>;
  isDrawerClick: boolean;
  setIsDrawerClick: React.Dispatch<React.SetStateAction<boolean>>;
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
  const [ userData, setUserData ] = useState<User | null>(null);
  const [ characterData, setCharacterData ] = useState<Character[] | null>(null);
  const [ inputText, setInputText ] = useState<string>('');
  const [ remainingTokens, setRemainingTokens ] = useState<number>(0);
  const [ isDrawerClick, setIsDrawerClick ] = useState<boolean>(false);

  return (
    <HelperContext.Provider 
      value={{ userData, setUserData, 
               characterData, setCharacterData, 
               inputText, setInputText,
               remainingTokens, setRemainingTokens,
               isDrawerClick, setIsDrawerClick}}>
      {children}
    </HelperContext.Provider>
  );
};
