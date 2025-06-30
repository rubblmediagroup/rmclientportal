import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

interface User {
  id: string;
  email: string;
  role: 'super_admin' | 'agency_admin' | 'team_member' | 'client_admin' | 'client_user' | 'guest';
  name: string;
  agencyId?: string;
  clientId?: string;
}

interface AgencySettings {
  id: string;
  name: string;
  domain: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  customCss?: string;
}

interface AppContextType {
  user: User | null;
  agencySettings: AgencySettings | null;
  isAuthenticated: boolean;
  sidebarOpen: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  toggleSidebar: () => void;
  updateAgencySettings: (settings: Partial<AgencySettings>) => void;
  createClientAccount: (clientData: any) => Promise<boolean>;
}

const defaultAppContext: AppContextType = {
  user: null,
  agencySettings: null,
  isAuthenticated: false,
  sidebarOpen: false,
  login: async () => false,
  logout: () => {},
  toggleSidebar: () => {},
  updateAgencySettings: () => {},
  createClientAccount: async () => false,
};

const AppContext = createContext<AppContextType>(defaultAppContext);

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [agencySettings, setAgencySettings] = useState<AgencySettings | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      if (email && password) {
        const mockUser: User = {
          id: '1',
          email,
          role: email.includes('admin') ? 'agency_admin' : 'client_user',
          name: email.split('@')[0],
          agencyId: '1'
        };
        
        const mockAgency: AgencySettings = {
          id: '1',
          name: 'Rubbl Media',
          domain: 'rubblmedia.com',
          logoUrl: '',
          primaryColor: '#2563eb',
          secondaryColor: '#7c3aed'
        };
        
        setUser(mockUser);
        setAgencySettings(mockAgency);
        localStorage.setItem('user', JSON.stringify(mockUser));
        localStorage.setItem('agencySettings', JSON.stringify(mockAgency));
        
        toast({
          title: "Login successful",
          description: `Welcome back, ${mockUser.name}!`,
        });
        
        return true;
      }
      return false;
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setAgencySettings(null);
    localStorage.removeItem('user');
    localStorage.removeItem('agencySettings');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const updateAgencySettings = (settings: Partial<AgencySettings>) => {
    if (agencySettings) {
      const updated = { ...agencySettings, ...settings };
      setAgencySettings(updated);
      localStorage.setItem('agencySettings', JSON.stringify(updated));
    }
  };

  const createClientAccount = async (clientData: any): Promise<boolean> => {
    try {
      // Mock client creation
      toast({
        title: "Client account created",
        description: `Client account for ${clientData.name || 'New Client'} has been created successfully.`,
      });
      return true;
    } catch (error) {
      toast({
        title: "Failed to create client",
        description: "There was an error creating the client account.",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedAgency = localStorage.getItem('agencySettings');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedAgency) {
      setAgencySettings(JSON.parse(savedAgency));
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        agencySettings,
        isAuthenticated: !!user,
        sidebarOpen,
        login,
        logout,
        toggleSidebar,
        updateAgencySettings,
        createClientAccount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};