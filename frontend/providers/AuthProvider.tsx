"use client";

import {
  createContext,
  startTransition,
  useEffect,
  useState,
} from "react";

import { loginUser, registerUser, type LoginInput, type RegisterInput } from "@/lib/api/auth";
import {
  clearSession,
  readSession,
  saveSession,
  type SessionState,
  type SessionUser,
} from "@/lib/auth/session";

type AuthContextValue = {
  isAuthenticated: boolean;
  isReady: boolean;
  login: (input: LoginInput) => Promise<void>;
  logout: () => void;
  register: (input: RegisterInput) => Promise<void>;
  token: string | null;
  user: SessionUser | null;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<SessionState | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    startTransition(() => {
      setSession(readSession());
      setIsReady(true);
    });
  }, []);

  const applySession = (nextSession: SessionState) => {
    saveSession(nextSession);
    setSession(nextSession);
  };

  const login = async (input: LoginInput) => {
    const response = await loginUser(input);
    applySession(response);
  };

  const register = async (input: RegisterInput) => {
    await registerUser(input);
    await login({
      email: input.email,
      password: input.password,
    });
  };

  const logout = () => {
    clearSession();
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: Boolean(session?.token),
        isReady,
        login,
        logout,
        register,
        token: session?.token ?? null,
        user: session?.user ?? null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
