import { useState, createContext, useContext } from 'react';
import { User, Character } from '@/app/_types'; 

type HelperContextType = {
  userData: User | null;
  setUserData: React.Dispatch<React.SetStateAction<User | null>>;
  inputText: string;
  setInputText: React.Dispatch<React.SetStateAction<string>>;
  remainingTokens: number;
  setRemainingTokens: React.Dispatch<React.SetStateAction<number>>;
  isDrawerClick: boolean;
  setIsDrawerClick: React.Dispatch<React.SetStateAction<boolean>>;
  drawerLink: string;
  setDrawerLink: React.Dispatch<React.SetStateAction<string>>;
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
  const [ inputText, setInputText ] = useState<string>('');
  const [ remainingTokens, setRemainingTokens ] = useState<number>(0);
  const [ isDrawerClick, setIsDrawerClick ] = useState<boolean>(false);
  const [ drawerLink, setDrawerLink ] = useState<string>('');

  return (
    <HelperContext.Provider 
      value={{ userData, setUserData, 
               inputText, setInputText,
               remainingTokens, setRemainingTokens,
               isDrawerClick, setIsDrawerClick,
               drawerLink, setDrawerLink}}>
      {children}
    </HelperContext.Provider>
  );
};
