import { createContext, useEffect, useState } from "react";
import { userGetme } from "./services/auth.api";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

    const getMe = async () => {
      try {
        setLoading(true);
        const data = await userGetme();
        setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      getMe();
    }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading , getMe, setLoading}}>
      {children}
    </AuthContext.Provider>
  );
};
