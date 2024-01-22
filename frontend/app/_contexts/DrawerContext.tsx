import { useState, createContext, useContext } from 'react';

type DrawerContextType = {
  isDrawerClick:    boolean;
  setIsDrawerClick: React.Dispatch<React.SetStateAction<boolean>>;
  drawerLink: string;
  setDrawerLink: React.Dispatch<React.SetStateAction<string>>;
  isHamburgerClick: boolean;
  setIsHamburgerClick: React.Dispatch<React.SetStateAction<boolean>>;
  drawerWidth: string;
  setDrawerWidth: React.Dispatch<React.SetStateAction<string>>;
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
  const [isDrawerClick,    setIsDrawerClick]    = useState<boolean>(false);
  const [drawerLink,       setDrawerLink]       = useState<string>('');
  const [isHamburgerClick, setIsHamburgerClick] = useState<boolean>(false);
  const [drawerWidth,      setDrawerWidth]      = useState<string>('w-[5vw]');

  return (
    <DrawerContext.Provider 
      value={{
        isDrawerClick,
        setIsDrawerClick,
        drawerLink,
        setDrawerLink,
        isHamburgerClick,
        setIsHamburgerClick,
        drawerWidth,
        setDrawerWidth,
      }}>
      {children}
    </DrawerContext.Provider>
  );
};
