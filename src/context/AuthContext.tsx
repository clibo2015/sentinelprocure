import React, { createContext, useContext, useState, useCallback } from 'react';
import { seedUsers, type SeedUser } from '../data/seedUsers';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: 'LOGIN' | 'LOGOUT' | 'PAGE_ACCESS';
  details: string;
  ipAddress: string;
}

interface AuthContextType {
  user: SeedUser | null;
  login: (email: string, password?: string) => boolean;
  logout: () => void;
  logPageAccess: (pageId: string) => void;
  auditLogs: AuditLogEntry[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SeedUser | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);

  // Helper to get a mock IP based on user
  const getMockIp = useCallback((userId: string) => {
    const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return `196.25.${hash % 255}.${(hash * 3) % 255}`;
  }, []);

  const addLog = useCallback((userId: string, userName: string, userRole: string, action: 'LOGIN' | 'LOGOUT' | 'PAGE_ACCESS', details: string) => {
    const newLog: AuditLogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      userId,
      userName,
      userRole,
      action,
      details,
      ipAddress: getMockIp(userId)
    };
    setAuditLogs(prev => [newLog, ...prev]);
  }, [getMockIp]);

  const login = useCallback((email: string, password?: string) => {
    const foundUser = seedUsers.find(u => u.email === email && (!u.password || u.password === password));
    if (foundUser) {
      setUser(foundUser);
      addLog(foundUser.id, foundUser.name, foundUser.role, 'LOGIN', 'Successful authentication via seed credentials');
      return true;
    }
    return false;
  }, [addLog]);

  const logout = useCallback(() => {
    setUser(prevUser => {
      if (prevUser) {
        addLog(prevUser.id, prevUser.name, prevUser.role, 'LOGOUT', 'User session terminated gracefully');
      }
      return null;
    });
  }, [addLog]);

  const logPageAccess = useCallback((pageId: string) => {
    setUser(prevUser => {
      if (prevUser) {
        addLog(prevUser.id, prevUser.name, prevUser.role, 'PAGE_ACCESS', `Accessed page: ${pageId}`);
      }
      return prevUser;
    });
  }, [addLog]);

  return (
    <AuthContext.Provider value={{ user, login, logout, logPageAccess, auditLogs }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
