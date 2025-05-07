import React, { ReactNode } from "react";
import { AuthContext, useAuthData } from "../../hooks/useAuth";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const authData = useAuthData();
  
  return (
    <AuthContext.Provider value={authData}>
      {children}
    </AuthContext.Provider>
  );
};