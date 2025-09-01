import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null); // null = loading state

  useEffect(() => {
    const stored = localStorage.getItem("auth");
    if (stored) {
      setAuth(JSON.parse(stored));
    } else {
      setAuth({ user: null, token: null, loggedIn: false });
    }
  }, []);

  useEffect(() => {
    if (auth !== null) {
      localStorage.setItem("auth", JSON.stringify(auth));
    }
  }, [auth]);

  if (auth === null) {
    return null; // prevent redirect flicker
  }

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
