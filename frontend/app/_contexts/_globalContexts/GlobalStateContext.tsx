import { useState, createContext, useContext } from 'react'

type GlobalStateContextType = {
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  isModalOpen: boolean
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

type ChildrenType = {
  children: React.ReactNode
}

const GlobalStateContext = createContext<GlobalStateContextType | null>(null)

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext)
  if (!context) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider')
  }
  return context
}

export const GlobalStateProvider = ({ children }: ChildrenType) => {
  // User関係の情報を取得するContext
  // currentUserをnullにしないための初期値
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  return (
    <GlobalStateContext.Provider
      value={{
        isLoading,
        setIsLoading,
        isModalOpen,
        setIsModalOpen,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  )
}
