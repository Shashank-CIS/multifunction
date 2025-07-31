import React, { createContext, useContext, useState, useEffect } from 'react';

export type Designation = 
  | 'System Engineer'
  | 'Sr. System Engineer'
  | 'Tech Lead'
  | 'Infra Technology Specialist'
  | 'Manager'
  | 'Sr. Manager'
  | 'Associate'
  | 'Sr. Associate'
  | 'Contractor';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Designation;
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

// Helper functions to determine role levels
const isManagerLevel = (role: Designation): boolean => {
  return role === 'Manager' || role === 'Sr. Manager';
};

const isEngineerLevel = (role: Designation): boolean => {
  return role === 'System Engineer' || 
         role === 'Sr. System Engineer' || 
         role === 'Tech Lead' || 
         role === 'Infra Technology Specialist' ||
         role === 'Associate' ||
         role === 'Sr. Associate' ||
         role === 'Contractor';
};

// Predefined users
const USERS: User[] = [
  {
    id: 'eng001',
    email: 'Shashankagowda.s@cognizant.com',
    name: 'Shashankagowda S',
    role: 'Sr. System Engineer',
    engineerId: '2171826'
  },
  {
    id: 'eng002', 
    email: 'Pradip.Shinde@cognizant.com',
    name: 'Pradip Shinde',
    role: 'System Engineer',
    engineerId: '2268205'
  },
  {
    id: 'mgr001',
    email: 'Manager@cognizant.com',
    name: 'Manager',
    role: 'Manager'
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
    isManager: user ? isManagerLevel(user.role) : false,
    isEngineer: user ? isEngineerLevel(user.role) : false
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