import { useState, createContext, useContext } from 'react'

import { User } from '@/app/_types'

type UserInfoContextType = {
  users: User[]
  setUsers: (users: User[]) => void
  currentUser: User
  setCurrentUser: (user: User) => void
}

type ChildrenType = {
  children: React.ReactNode
}

const UserInfoContext = createContext<UserInfoContextType | null>(null)

export const useUserInfo = () => {
  const context = useContext(UserInfoContext)
  if (!context) {
    throw new Error('useUserInfo must be used within a UserInfoProvider')
  }
  return context
}

export const UserInfoProvider = ({ children }: ChildrenType) => {
  // User関係の情報を取得するContext
  // currentUserをnullにしないための初期値
  const nullUser: User = {
    id: 0,
    name: '',
    email: '',
    avatar: '',
    token: 0,
  }

  const [users, setUsers] = useState<User[]>([])
  const [currentUser, setCurrentUser] = useState<User>(nullUser)

  return (
    <UserInfoContext.Provider
      value={{
        users,
        setUsers,
        currentUser,
        setCurrentUser,
      }}
    >
      {children}
    </UserInfoContext.Provider>
  )
}
