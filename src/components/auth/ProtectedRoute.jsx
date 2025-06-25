import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext.jsx';
import LoginForm from './LoginForm.jsx';
import { COLORS } from '../../constants/styles.js';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, login } = useAuth();

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          backgroundColor: COLORS.background,
        }}
      >
        <CircularProgress size={60} sx={{ color: COLORS.primary }} />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm onLoginSuccess={login} />;
  }

  return children;
};

export default ProtectedRoute;
