"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { authService, UserProfile } from "@/services/auth.service";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(null);

  // Initialize token from cookies
  useEffect(() => {
    const savedToken = Cookies.get("token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const { data: profileResponse, isLoading } = useQuery({
    queryKey: ["authProfile"],
    queryFn: () => authService.getProfile(),
    enabled: !!token,
    retry: false,
  });

  const user = profileResponse?.data || null;
  const isAuthenticated = !!user;

  const login = (newToken: string) => {
    Cookies.set("token", newToken, { expires: 1 }); // expires in 1 day
    setToken(newToken);
    queryClient.invalidateQueries({ queryKey: ["authProfile"] });
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      // ignore if token is already invalid
    } finally {
      Cookies.remove("token");
      setToken(null);
      queryClient.clear();
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
