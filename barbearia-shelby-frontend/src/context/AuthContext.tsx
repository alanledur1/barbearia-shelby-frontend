import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulação de verificação de autenticação
    const checkAuth = async () => {
      // Aqui você pode fazer uma chamada à API para verificar a autenticação
      const response = await fetch('/api/auth/check'); // Exemplo de endpoint
      const data = await response.json();
      setIsAuthenticated(data.isAuthenticated);
      setLoading(false);
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};