import React, { useState, createContext, useContext } from "react";

type AvatarContextType = {
  helperPageAvatarURL: string;
  setHelperPageAvatarURL: React.Dispatch<React.SetStateAction<string>>;
};

const AvatarContext = createContext<AvatarContextType | null>(null);

export const useHelperPageAvatar = () => useContext(AvatarContext);

export const AvatarProvider: React.FC = ({ children }) => {
  const [helperPageAvatarURL, setHelperPageAvatarURL] = useState<string>('/images/helper/man.png');

  return (
    <AvatarContext.Provider value={{ helperPageAvatarURL, setHelperPageAvatarURL }}>
      {children}
    </AvatarContext.Provider>
  );
};
