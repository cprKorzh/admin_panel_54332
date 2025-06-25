import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import AdminLayout from './components/layout/AdminLayout.jsx';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';
import UsersTable from './components/users/UsersTable.jsx';
import UserRegistration from './components/users/UserRegistration.jsx';
import DrivingManagement from './components/driving/DrivingManagement.jsx';
import ExamManagement from './components/exams/ExamManagement.jsx';
import TimetableManagement from './components/timetable/TimetableManagement.jsx';
import { COLORS } from './constants/styles.js';
import './App.css';

// Создаем тему в стиле mobile_client
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: COLORS.primary,
      light: '#FF6B9D',
      dark: '#D6003A',
    },
    secondary: {
      main: COLORS.secondary,
      light: '#6BCF7F',
      dark: '#2E7D32',
    },
    background: {
      default: COLORS.background,
      paper: COLORS.surface,
    },
    text: {
      primary: COLORS.text,
      secondary: COLORS.muted,
    },
    error: {
      main: COLORS.error,
    },
    warning: {
      main: COLORS.warning,
    },
    info: {
      main: COLORS.info,
    },
    success: {
      main: COLORS.success,
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
    h1: { fontWeight: 600 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <ProtectedRoute>
              <AdminLayout>
                <Routes>
                  <Route path="/" element={<UsersTable />} />
                  <Route path="/register" element={<UserRegistration />} />
                  <Route path="/driving" element={<DrivingManagement />} />
                  <Route path="/exams" element={<ExamManagement />} />
                  <Route path="/timetable" element={<TimetableManagement />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </AdminLayout>
            </ProtectedRoute>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
