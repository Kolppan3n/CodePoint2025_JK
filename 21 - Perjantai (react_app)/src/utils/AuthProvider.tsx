import React, { createContext, useContext, useState } from "react";

// Määritellään kontekstin tyyppi
interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (loginData: {}) => void;
  logout: () => void;
}

// Luodaan konteksti ja annetaan sille tyyppi
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    // Alustetaan token localStorage:sta, jos se on olemassa
    return localStorage.getItem("authToken");
  });

  const logout = () => {
    localStorage.removeItem("authToken");
    setToken(null);
  };

  const login = async (loginData: {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "Application/JSON" },
        body: JSON.stringify(loginData),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }
      const token = response.headers.get("Authorization");
      if (!token) {
        throw new Error("No token received from the server.");
      }

      //Tallennetaan tokeni contextiin ja localStorageen ilman "Bearer "-alkuosaa
      const cleanToken = token.replace("Bearer ", "");
      localStorage.setItem("authToken", cleanToken);
      setToken(cleanToken);

    } catch (error: any) {
      setError(error.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;
