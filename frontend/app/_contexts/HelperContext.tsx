import { useState, createContext, useContext } from 'react';

type HelperContextType = {
  inputText: string;
  setInputText: React.Dispatch<React.SetStateAction<string>>;
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
  const [ inputText, setInputText ] = useState<string>('');

  return (
    <HelperContext.Provider value={{ inputText, setInputText }}>
      {children}
    </HelperContext.Provider>
  );
};
