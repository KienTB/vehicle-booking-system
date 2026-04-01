"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User, LoginRequest, RegisterRequest, UserRole } from "@/lib/types";
import { authService } from "@/lib/services/auth-service";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
  hasRole: (role: UserRole) => boolean;
  isAdmin: boolean;
  isCustomer: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = () => {
      const storedUser = authService.getStoredUser();
      const token = authService.getStoredToken();
      
      if (storedUser && token) {
        setUser(storedUser);
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback(async (data: LoginRequest) => {
    const response = await authService.login(data);
    const normalizedRole = response.role?.toUpperCase() === "ADMIN" ? "ADMIN" : "USER";
    const userData: User = {
      id: response.userId,
      username: response.phone,
      email: "",
      fullName: response.name,
      phone: response.phone,
      role: normalizedRole,
    };
    
    authService.setAuthData(response.token, userData);
    setUser(userData);

    // Redirect based on role
    if (userData.role === "ADMIN") {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }
  }, [router]);

  const register = useCallback(async (data: RegisterRequest) => {
    await authService.register(data);
    router.push("/login?registered=true");
  }, [router]);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    router.push("/login");
  }, [router]);

  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  }, []);

  const hasRole = useCallback((role: UserRole) => {
    return user?.role === role;
  }, [user]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
    hasRole,
    isAdmin: user?.role === "ADMIN",
    isCustomer: user?.role === "USER",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
