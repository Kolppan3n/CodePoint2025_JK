import React, { createContext, useContext, useState } from "react";
import type { Kayttaja, LoginResponse } from "./Types";

// Määritellään kontekstin tyyppi
interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  userData: Kayttaja | null;
  login: (loginData: {}) => void;
  logout: () => void;
}

// Luodaan konteksti ja annetaan sille tyyppi
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<Kayttaja | null>(() => {
    const stored = localStorage.getItem("userData");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState<string | null>(localStorage.getItem("authToken"));

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    setToken(null);
    setUserData(null);
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

      const resJson: LoginResponse = await response.json();
      console.log("Login response:", resJson);
      const token = resJson.token;
      if (!token) {
        throw new Error("No token received from the server.");
      }

      //Tallentaan käyttäjän tiedot contextiin ja localStorageen
      setUserData(resJson.data);
      localStorage.setItem("userData", JSON.stringify(resJson.data));

      //Tallennetaan tokeni contextiin ja localStorageen ilman "Bearer "-alkuosaa
      localStorage.setItem("authToken", token);
      setToken(token);

    } catch (error: any) {
      setError(error.message);
      throw error; // Heitetään virhe edelleen, jotta se voidaan käsitellä kutsujassa
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, loading, error, userData, login, logout }}
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
