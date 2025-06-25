import React from 'react';
import {
  Box,
  Alert,
  AlertTitle,
  Button,
  Typography,
  Container,
  Card,
  CardContent,
} from '@mui/material';
import { Refresh as RefreshIcon, Home as HomeIcon } from '@mui/icons-material';
import { COLORS } from '../../constants/styles.js';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="md" sx={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: COLORS.background,
          py: 3,
        }}>
          <Card sx={{ 
            width: '100%', 
            maxWidth: 600,
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                <AlertTitle>Произошла ошибка приложения</AlertTitle>
                Что-то пошло не так. Попробуйте перезагрузить страницу или вернуться на главную.
              </Alert>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <Box sx={{ 
                  mt: 3, 
                  p: 2, 
                  backgroundColor: '#f5f5f5', 
                  borderRadius: 2,
                  textAlign: 'left',
                }}>
                  <Typography variant="subtitle2" color="error" sx={{ mb: 1 }}>
                    Детали ошибки (только в режиме разработки):
                  </Typography>
                  <Typography variant="body2" component="pre" sx={{ 
                    fontSize: '0.75rem',
                    overflow: 'auto',
                    maxHeight: 200,
                  }}>
                    {this.state.error.toString()}
                    {this.state.errorInfo.componentStack}
                  </Typography>
                </Box>
              )}

              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                justifyContent: 'center',
                mt: 3,
                flexWrap: 'wrap',
              }}>
                <Button
                  variant="contained"
                  startIcon={<RefreshIcon />}
                  onClick={this.handleReload}
                  sx={{
                    backgroundColor: COLORS.primary,
                    '&:hover': {
                      backgroundColor: COLORS.primary,
                      opacity: 0.9,
                    },
                  }}
                >
                  Перезагрузить
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<HomeIcon />}
                  onClick={this.handleGoHome}
                  sx={{
                    borderColor: COLORS.primary,
                    color: COLORS.primary,
                    '&:hover': {
                      borderColor: COLORS.primary,
                      backgroundColor: `${COLORS.primary}08`,
                    },
                  }}
                >
                  На главную
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
