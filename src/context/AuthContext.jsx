import { createContext, useState } from "react";
import { loginRequest } from "../api/auth";
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (payload) => {
    const res = await loginRequest(payload);

    const { account, access_token, refresh_token } = res.data;

    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
    localStorage.setItem("role", account.role_type);

    setUser(account);
    return account.role_type;
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
