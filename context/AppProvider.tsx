import React, { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
};
