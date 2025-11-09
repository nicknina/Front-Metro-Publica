import React, { createContext, useContext, useState, useEffect } from "react";
import { MockUser, UserRole } from "@/data/mockData";

interface AuthResponseData {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
}

interface AuthContextType {
  user: MockUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  changePassword: (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ) => Promise<{ success: boolean; message: string }>;
  updateAccount: (
    name: string,
    email: string
  ) => Promise<{ success: boolean; message: string; user: MockUser | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = "http://localhost:8081/api";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("bimtrack_user");
    const storedToken = localStorage.getItem("bimtrack_token");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  const setSession = (data: AuthResponseData) => {
    const appUser: MockUser = {
      ...data.user,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.name}`,
    };

    setUser(appUser);
    setToken(data.token);
    localStorage.setItem("bimtrack_user", JSON.stringify(appUser));
    localStorage.setItem("bimtrack_token", data.token);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        return false;
      }

      const data: AuthResponseData = await response.json();
      setSession(data);
      return true;
    } catch (error) {
      console.error("Erro ao conectar com o backend (login):", error);
      return false;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (response.status === 400) {
        return false;
      }

      if (!response.ok) {
        console.error("Erro ao registrar no backend:", response.statusText);
        throw new Error("Erro no servidor");
      }

      const data: AuthResponseData = await response.json();
      setSession(data);
      return true;
    } catch (error) {
      console.error("Erro ao conectar com o backend (register):", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("bimtrack_user");
    localStorage.removeItem("bimtrack_token");
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<{ success: boolean; message: string }> => {
    if (!token) {
      return { success: false, message: "Usuário não autenticado" };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/user/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });

      const responseText = await response.text();
      if (!response.ok) {
        return { success: false, message: responseText };
      }

      return { success: true, message: responseText };
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      return { success: false, message: "Erro de conexão com o servidor" };
    }
  };

  const updateAccount = async (
    name: string,
    email: string
  ): Promise<{ success: boolean; message: string; user: MockUser | null }> => {
    if (!token) {
      return { success: false, message: "Usuário não autenticado", user: null };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/user/update-account`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        return { success: false, message: errorMessage, user: null };
      }

      const data: AuthResponseData = await response.json();
      const appUser: MockUser = {
        ...data.user,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.name}`,
      };
      setUser(appUser);
      localStorage.setItem("bimtrack_user", JSON.stringify(appUser));

      return { success: true, message: "Conta atualizada!", user: appUser };
    } catch (error) {
      console.error("Erro ao atualizar conta:", error);
      return { success: false, message: "Erro de conexão", user: null };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!user && !!token,
        changePassword,
        updateAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
