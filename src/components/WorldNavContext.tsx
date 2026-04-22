import { createContext, useContext, useState, ReactNode } from 'react';

interface WorldNavContextType {
  worldMode: boolean;
  enterWorld: () => void;
  exitWorld: () => void;
}

const WorldNavContext = createContext<WorldNavContextType>({
  worldMode: false,
  enterWorld: () => {},
  exitWorld: () => {},
});

export const useWorldNav = () => useContext(WorldNavContext);

export const WorldNavProvider = ({ children }: { children: ReactNode }) => {
  const [worldMode, setWorldMode] = useState(false);

  return (
    <WorldNavContext.Provider
      value={{
        worldMode,
        enterWorld: () => setWorldMode(true),
        exitWorld: () => setWorldMode(false),
      }}
    >
      {children}
    </WorldNavContext.Provider>
  );
};
