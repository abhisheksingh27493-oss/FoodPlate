import { createContext, useState, useContext, useEffect } from 'react';
import authApi from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = authApi.getToken();
      
      if (token) {
        try {
          const data = await authApi.getMe();
          setUser(data.user);
        } catch (err) {
          console.error('Failed to load user:', err);
          authApi.logout();
        }
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  // Register
  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      const data = await authApi.register(userData);
      setUser(data.user);
      return { success: true, data };
    } catch (err) {
      const errorMsg = err.message || err.errors?.[0] || 'Registration failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (credentials) => {
    try {
      setError(null);
      setLoading(true);
      const data = await authApi.login(credentials);
      setUser(data.user);
      return { success: true, data };
    } catch (err) {
      const errorMsg = err.message || err.errors?.[0] || 'Login failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    authApi.logout();
    setUser(null);
    setError(null);
  };

  // Google login
  const googleLogin = () => {
    authApi.googleLogin();
  };

  // Update user
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    googleLogin,
    updateUser,
    clearError,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;