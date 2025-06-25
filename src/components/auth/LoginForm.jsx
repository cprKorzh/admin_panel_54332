import React, { useState, useEffect } from 'react';
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Container,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import { Login as LoginIcon, AdminPanelSettings } from '@mui/icons-material';
import { apiService } from '../../services/api.js';
import { COLORS, SPACING } from '../../constants/styles.js';

const LoginForm = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [serverStatus, setServerStatus] = useState('checking');

  useEffect(() => {
    checkServerHealth();
  }, []);

  const checkServerHealth = async () => {
    try {
      const isHealthy = await apiService.healthCheck();
      setServerStatus(isHealthy ? 'online' : 'offline');
    } catch (error) {
      setServerStatus('offline');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Очищаем ошибку при изменении полей
    if (error) {
      setError(null);
    }
  };

  const validateForm = () => {
    if (!formData.identifier.trim()) {
      setError('Введите логин или email');
      return false;
    }
    
    if (!formData.password) {
      setError('Введите пароль');
      return false;
    }
    
    if (formData.password.length < 3) {
      setError('Пароль должен содержать минимум 3 символа');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('Attempting login with:', formData.identifier);
      
      const response = await onLoginSuccess(formData.identifier, formData.password);
      
      console.log('Login successful:', response);
      
    } catch (err) {
      console.error('Login error:', err);
      
      // Обработка различных типов ошибок
      let errorMessage = 'Произошла ошибка при входе';
      
      if (err.message) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getServerStatusColor = () => {
    switch (serverStatus) {
      case 'online': return COLORS.success;
      case 'offline': return COLORS.error;
      default: return COLORS.warning;
    }
  };

  const getServerStatusText = () => {
    switch (serverStatus) {
      case 'online': return 'Сервер доступен';
      case 'offline': return 'Сервер недоступен';
      default: return 'Проверка сервера...';
    }
  };

  return (
    <Container maxWidth="sm" sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: COLORS.background,
      py: 3,
    }}>
      <Card sx={{ 
        width: '100%', 
        maxWidth: 420,
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            mb: 3,
          }}>
            <Box sx={{
              backgroundColor: COLORS.primary,
              borderRadius: '50%',
              p: 2,
              mb: 2,
            }}>
              <AdminPanelSettings sx={{ color: 'white', fontSize: 32 }} />
            </Box>
            <Typography variant="h4" component="h1" fontWeight={600} color={COLORS.text}>
              Gear Up
            </Typography>
            <Typography variant="h6" component="h2" color={COLORS.muted} sx={{ mt: 1 }}>
              Административная панель
            </Typography>
          </Box>

          {/* Статус сервера */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            mb: 2,
          }}>
            <Box sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: getServerStatusColor(),
              mr: 1,
            }} />
            <Typography variant="body2" color={getServerStatusColor()}>
              {getServerStatusText()}
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {serverStatus === 'offline' && (
            <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
              Сервер недоступен. Проверьте подключение к интернету или обратитесь к администратору.
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              required
              label="Логин или Email"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              variant="outlined"
              sx={{ mb: 2 }}
              disabled={loading || serverStatus === 'offline'}
              autoComplete="username"
              placeholder="Введите логин или email"
            />
            
            <TextField
              fullWidth
              required
              type="password"
              label="Пароль"
              name="password"
              value={formData.password}
              onChange={handleChange}
              variant="outlined"
              sx={{ mb: 3 }}
              disabled={loading || serverStatus === 'offline'}
              autoComplete="current-password"
              placeholder="Введите пароль"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading || serverStatus === 'offline'}
              sx={{
                backgroundColor: COLORS.primary,
                '&:hover': {
                  backgroundColor: COLORS.primary,
                  opacity: 0.9,
                },
                '&:disabled': {
                  backgroundColor: COLORS.muted,
                  color: 'white',
                },
                borderRadius: 2,
                py: 1.5,
                fontWeight: 600,
                fontSize: '1.1rem',
              }}
            >
              {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                  Вход...
                </Box>
              ) : (
                <>
                  <LoginIcon sx={{ mr: 1 }} />
                  Войти
                </>
              )}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color={COLORS.muted} sx={{ mb: 1 }}>
              Тестовые данные для входа:
            </Typography>
            <Typography variant="body2" color={COLORS.text} fontWeight={500}>
              Логин: <code>admin</code>
            </Typography>
            <Typography variant="body2" color={COLORS.text} fontWeight={500}>
              Пароль: <code>123123</code>
            </Typography>
          </Box>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="caption" color={COLORS.muted}>
              Только пользователи с правами администратора могут войти в систему
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default LoginForm;
