import { useState, createContext, useContext } from 'react';

type DrawerContextType = {
  isDrawerClick:    boolean;
  setIsDrawerClick: React.Dispatch<React.SetStateAction<boolean>>;
  drawerLink: string;
  setDrawerLink: React.Dispatch<React.SetStateAction<string>>;
};

type ChildrenType = {
  children: React.ReactNode;
};

const DrawerContext = createContext<DrawerContextType | null>(null);

export const useDrawer = () => {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error('useDrawer must be used within a DrawerProvider');
  }
  return context;
};

export const DrawerProvider = ({ children }: ChildrenType) => {
  const [isDrawerClick, setIsDrawerClick] = useState<boolean>(false);
  const [drawerLink,    setDrawerLink]    = useState<string>('');

  return (
    <DrawerContext.Provider 
      value={{
        isDrawerClick,
        setIsDrawerClick,
        drawerLink,
        setDrawerLink
      }}>
      {children}
    </DrawerContext.Provider>
  );
};
