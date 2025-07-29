import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'engineer' | 'manager';
  engineerId?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isManager: boolean;
  isEngineer: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Predefined users
const USERS: User[] = [
  {
    id: 'eng001',
    email: 'Shashankagowda.s@cognizant.com',
    name: 'Shashankagowda S',
    role: 'engineer',
    engineerId: '2171826'
  },
  {
    id: 'eng002', 
    email: 'Pradip.Shinde@cognizant.com',
    name: 'Pradip Shinde',
    role: 'engineer',
    engineerId: '2268205'
  },
  {
    id: 'mgr001',
    email: 'Manager@cognizant.com',
    name: 'Manager',
    role: 'manager'
  }
];

const PASSWORD = 'Admin';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Find user by email
    const foundUser = USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (foundUser && password === PASSWORD) {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isManager: user?.role === 'manager',
    isEngineer: user?.role === 'engineer'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 