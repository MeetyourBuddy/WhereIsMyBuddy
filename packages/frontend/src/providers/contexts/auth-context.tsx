import { IServiceResponse } from '@/types';
import { IUser } from '@/types/auth-types';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface AuthContextType {
  user: IServiceResponse<IUser> | null;
  setUser: (user: IServiceResponse<IUser> | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IServiceResponse<IUser> | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuthContext must be used within an AuthProvider');
  return context;
};
