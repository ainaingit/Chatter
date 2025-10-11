import React, { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';

interface AppProviderProps {
  children: ReactNode;
}

export const AppProviders = ({ children }: AppProviderProps) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
};
