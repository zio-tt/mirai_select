import { useState, createContext, useContext } from "react";

type TopPageContextType = {
  isViewing: boolean;
  setIsViewing: React.Dispatch<React.SetStateAction<boolean>>;
  isViewed: boolean;
  setIsViewed: React.Dispatch<React.SetStateAction<boolean>>;
};

type ChildrenType = {
  children: React.ReactNode;
};

const TopPageContext = createContext<TopPageContextType | null>(null);
export const useTopPage = () => {
  const context = useContext(TopPageContext);
  if (!context) {
    throw new Error('useTopPage must be used within a TopPageProvider');
  }
  return context;
};

export default function TopPageProvider({ children }: ChildrenType) {
  const [ isViewing, setIsViewing ] = useState<boolean>(false);
  const [ isViewed, setIsViewed ] = useState<boolean>(false);

  return (
    <TopPageContext.Provider
     value={{ isViewing, setIsViewing, isViewed, setIsViewed }}>
      {children}
    </TopPageContext.Provider>
  );
};
