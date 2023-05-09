import { createContext, useEffect, useState, ReactNode } from 'react'

import { IAuth } from '../interfaces/user/auth';
import { MUser } from '../models/user/user';
import {useAppSelector} from '../hooks/redux';

const defaultProvider: IAuth = {
  isAuthenticated: false,
  user: null,
  loaded: false
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<MUser | null>(defaultProvider.user)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(defaultProvider.isAuthenticated)
  const [loaded, setLoaded] = useState<boolean>(defaultProvider.loaded)
  const { authReducer } = useAppSelector((state) => state);

  useEffect(() => {
    if (authReducer.user) {
      setIsAuthenticated(true)
      setUser(authReducer.user)
    } else {
      setIsAuthenticated(false)
      setUser(null)
    }

    setLoaded(true)
  }, [authReducer.user])

  const values = {
    user,
    isAuthenticated,
    loaded
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
