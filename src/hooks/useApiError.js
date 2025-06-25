import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';

export const useApiError = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();

  const handleApiCall = useCallback(async (apiCall, options = {}) => {
    const { 
      showLoading = true, 
      onSuccess, 
      onError,
      clearErrorOnStart = true 
    } = options;

    try {
      if (showLoading) setLoading(true);
      if (clearErrorOnStart) setError(null);

      const result = await apiCall();

      if (onSuccess) {
        onSuccess(result);
      }

      return result;
    } catch (err) {
      console.error('API Error:', err);

      // Обработка ошибок аутентификации
      if (err.message.includes('Сессия истекла') || 
          err.message.includes('401') ||
          err.message.includes('Unauthorized')) {
        logout();
        return;
      }

      // Обработка других ошибок
      let errorMessage = 'Произошла неизвестная ошибка';
      
      if (err.message) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }

      setError(errorMessage);

      if (onError) {
        onError(err);
      }

      throw err;
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [logout]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    loading,
    handleApiCall,
    clearError,
    setError,
    setLoading,
  };
};

export default useApiError;
