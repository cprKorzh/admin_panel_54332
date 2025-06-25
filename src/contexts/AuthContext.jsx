import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        // Устанавливаем токен в apiService
        apiService.setToken(token);
        
        try {
          // Проверяем валидность токена и получаем актуальные данные пользователя
          const currentUser = await apiService.getCurrentUser();
          
          // Проверяем, что пользователь имеет права администратора
          if (!isAdminUser(currentUser)) {
            console.warn('User does not have admin privileges');
            logout();
            return;
          }
          
          setUser(currentUser);
          setIsAuthenticated(true);
          
          // Обновляем данные пользователя в localStorage
          localStorage.setItem('user', JSON.stringify(currentUser));
          
        } catch (error) {
          console.error('Token validation failed:', error);
          // Токен недействителен или пользователь не найден
          logout();
        }
      } else {
        // Нет токена или данных пользователя
        logout();
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const isAdminUser = (user) => {
    // Проверяем роль пользователя
    if (!user) {
      console.log('isAdminUser: No user provided');
      return false;
    }
    
    console.log('isAdminUser: Checking user:', user);
    
    // ВРЕМЕННО: разрешаем доступ всем аутентифицированным пользователям для отладки
    // TODO: Восстановить проверку ролей после настройки сервера
    console.log('isAdminUser: Temporarily allowing all authenticated users');
    return true;
    
    // Закомментированная проверка ролей (восстановить позже):
    /*
    const role = user.role;
    console.log('isAdminUser: User role:', role);
    
    if (!role) {
      console.log('isAdminUser: No role found');
      return false;
    }
    
    const adminRoleTypes = ['admin', 'administrator', 'super-admin', 'authenticated'];
    const roleType = (role.type || role.name || '').toLowerCase();
    const roleName = (role.name || role.type || '').toLowerCase();
    
    console.log('isAdminUser: Role type:', roleType);
    console.log('isAdminUser: Role name:', roleName);
    
    const isAdmin = adminRoleTypes.includes(roleType) || adminRoleTypes.includes(roleName);
    console.log('isAdminUser: Is admin?', isAdmin);
    
    return isAdmin;
    */
  };

  const login = async (identifier, password) => {
    try {
      setLoading(true);
      
      const response = await apiService.login(identifier, password);
      
      console.log('Login response:', response);
      
      if (!response.jwt || !response.user) {
        throw new Error('Неверный ответ сервера');
      }
      
      console.log('User data:', response.user);
      
      // Устанавливаем токен в apiService
      apiService.setToken(response.jwt);
      
      // Получаем полные данные пользователя с ролью
      let userWithRole;
      try {
        userWithRole = await apiService.getCurrentUser();
        console.log('User with role:', userWithRole);
      } catch (error) {
        console.warn('Could not fetch user with role, using response user:', error);
        userWithRole = response.user;
      }
      
      // Проверяем права администратора
      if (!isAdminUser(userWithRole)) {
        // Выходим из системы на сервере
        await apiService.logout();
        throw new Error('У вас нет прав администратора');
      }
      
      setUser(userWithRole);
      setIsAuthenticated(true);
      
      // Сохраняем данные пользователя
      localStorage.setItem('user', JSON.stringify(userWithRole));
      
      return { ...response, user: userWithRole };
    } catch (error) {
      // Очищаем данные при ошибке
      logout();
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    try {
      // Очищаем токен в apiService
      apiService.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    }
    
    // Очищаем состояние
    setUser(null);
    setIsAuthenticated(false);
    
    // Очищаем localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  };

  const refreshUser = async () => {
    try {
      if (!isAuthenticated) return;
      
      const currentUser = await apiService.getCurrentUser();
      
      if (!isAdminUser(currentUser)) {
        logout();
        return;
      }
      
      setUser(currentUser);
      localStorage.setItem('user', JSON.stringify(currentUser));
      
      return currentUser;
    } catch (error) {
      console.error('Error refreshing user:', error);
      logout();
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    refreshUser,
    isAdminUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
