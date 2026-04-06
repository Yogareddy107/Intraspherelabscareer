import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminContextType {
  isAuthenticated: boolean;
  login: (pin: string) => Promise<boolean>;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const ADMIN_SESSION_KEY = 'intrasphere_admin_session';

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing session
    const session = sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (session === 'authenticated') {
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (pin: string): Promise<boolean> => {
    // Check against the stored PIN (default: 199188)
    const { supabase } = await import('@/integrations/supabase/client');
    
    const { data, error } = await supabase
      .from('admin_settings')
      .select('setting_value')
      .eq('setting_key', 'admin_pin')
      .single();

    if (error || !data) {
      console.error('Error fetching admin PIN:', error);
      return false;
    }

    if (data.setting_value === pin) {
      setIsAuthenticated(true);
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'authenticated');
      return true;
    }

    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  };

  return (
    <AdminContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
