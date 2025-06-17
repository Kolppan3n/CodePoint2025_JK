import React, { createContext, useContext, useState } from "react";
import type { Kayttaja, LoginResponse } from "./Types";

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
  const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem("refreshToken"));
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem("accessToken"));

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    setRefreshToken(null);
    setAccessToken(null);
  };

  const login = async (loginData: {}) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://localhost:8000/api/token/", {
        method: "POST",
        headers: { "Content-Type": "Application/JSON" },
        body: JSON.stringify(loginData),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      const resJson: LoginResponse = await response.json();
      console.log("Login response:", resJson);
      const refreshToken = resJson.refresh;
      const accessToken = resJson.access;
      if (!refreshToken || !accessToken) {
        throw new Error("No token received from the server.");
      }

      //Tallennetaan virkistysavain contextiin ja localStorageen
      localStorage.setItem("refreshToken", refreshToken);
      setRefreshToken(refreshToken);

      //Tallennetaan käyttöoikeusavain contextiin ja localStorageen
      localStorage.setItem("accessToken", accessToken);
      setAccessToken(accessToken);

    } catch (error: any) {
      setError(error.message);
      throw error; // Heitetään virhe edelleen, jotta se voidaan käsitellä kutsujassa
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = !!accessToken;

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, loading, error, login, logout }}
    >
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
