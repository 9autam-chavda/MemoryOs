import { createContext, useContext, useState } from "react";

import {
  getToken,
  getUser,
  saveAuth,
  clearAuth,
} from "../utils/token";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getToken());
  const [user, setUser] = useState(getUser());

  const login = (jwtToken, userData) => {
    saveAuth(jwtToken, userData);

    setToken(jwtToken);
    setUser(userData);
  };

  const logout = () => {
    clearAuth();

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};