import { useState, createContext, useContext } from 'react';

type IndexContextType = {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
};

type ChildrenType = {
  children: React.ReactNode;
};

const IndexContext = createContext<IndexContextType | null>(null);

export const useIndex = () => {
  const context = useContext(IndexContext);
  if (!context) {
    throw new Error('useIndex must be used within a IndexProvider');
  }
  return context;
};

export const IndexProvider = ({ children }: ChildrenType) => {
  const [ openModal, setOpenModal ] = useState<boolean>(false);

  return (
    <IndexContext.Provider 
      value={{ openModal, setOpenModal }}>
      {children}
    </IndexContext.Provider>
  );
};
