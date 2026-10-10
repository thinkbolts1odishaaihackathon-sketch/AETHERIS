import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getStoredToken } from '../services/api';
import type { User, UserRole, AuthResponse } from '../types/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (params: {
    email: string;
    password: string;
    name: string;
    role: UserRole;
    organization: string;
    department?: string;
  }) => Promise<AuthResponse>;
  loginWithSSO: (provider: string, email: string) => Promise<AuthResponse>;
  switchRole: (newRole: UserRole) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  hasRole: (allowedRoles: UserRole[]) => boolean;
  isRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize session
  useEffect(() => {
    const initSession = async () => {
      const stored = getStoredToken();
      if (stored) {
        const res = await api.getCurrentUser();
        if (res.success && res.user) {
          setUser(res.user);
          setToken(stored);
          setIsLoading(false);
          return;
        } else {
          setToken(null);
        }
      }

      setUser(null);
      setToken(null);
      setIsLoading(false);
    };

    initSession();
  }, []);

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    setIsLoading(true);
    const res = await api.login(email, password);
    if (res.success && res.user && res.token) {
      setUser(res.user);
      setToken(res.token);
    }
    setIsLoading(false);
    return res;
  };

  const register = async (params: {
    email: string;
    password: string;
    name: string;
    role: UserRole;
    organization: string;
    department?: string;
  }): Promise<AuthResponse> => {
    setIsLoading(true);
    const res = await api.register(params);
    if (res.success && res.user && res.token) {
      setUser(res.user);
      setToken(res.token);
    }
    setIsLoading(false);
    return res;
  };

  const loginWithSSO = async (provider: string, email: string): Promise<AuthResponse> => {
    setIsLoading(true);
    const res = await api.loginWithSSO(provider, email);
    if (res.success && res.user && res.token) {
      setUser(res.user);
      setToken(res.token);
    }
    setIsLoading(false);
    return res;
  };

  const switchRole = async (newRole: UserRole): Promise<AuthResponse> => {
    const res = await api.switchRole(newRole);
    if (res.success && res.user && res.token) {
      setUser(res.user);
      setToken(res.token);
    }
    return res;
  };

  const logout = async (): Promise<void> => {
    await api.logout();
    setUser(null);
    setToken(null);
  };

  const hasRole = (allowedRoles: UserRole[]): boolean => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  };

  const isRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        loginWithSSO,
        switchRole,
        logout,
        hasRole,
        isRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
