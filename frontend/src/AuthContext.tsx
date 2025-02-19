import React, { useContext, useMemo, useState } from 'react';

type AuthState = {
  token: string | null;
  isAuthenticated: boolean;
  setToken: (token: string | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
};

type AuthProviderProps = {
  children: React.ReactNode;
};

const AuthContext = React.createContext<AuthState>({} as AuthState);

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    localStorage.getItem('isAuthenticated') === 'true'
  );

  const value = useMemo(
    () => ({
      token,
      isAuthenticated,
      setToken: (tk: string | null) => {
        localStorage.setItem('token', tk ?? '');
        setToken(tk);
      },
      setIsAuthenticated: (isAuth: boolean) => {
        localStorage.setItem('isAuthenticated', String(isAuth));
        setIsAuthenticated(isAuth);
      },
    }),
    [token, isAuthenticated]
  );

  return <AuthContext.Provider value={value} children={children} />;
};

export default AuthProvider;
export const useAuth = () => useContext(AuthContext);
