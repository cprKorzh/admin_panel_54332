import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  DirectionsCar as DrivingIcon,
  Quiz as ExamIcon,
  Schedule as ScheduleIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import UserProfile from '../auth/UserProfile.jsx';
import { COLORS, SPACING } from '../../constants/styles.js';

const drawerWidth = 240;

const menuItems = [
  { text: 'Пользователи', icon: <PeopleIcon />, path: '/' },
  { text: 'Регистрация', icon: <PersonAddIcon />, path: '/register' },
  { text: 'Запись на вождение', icon: <DrivingIcon />, path: '/driving' },
  { text: 'Запись на экзамены', icon: <ExamIcon />, path: '/exams' },
  { text: 'Расписание', icon: <ScheduleIcon />, path: '/timetable' },
];

const AdminLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClick = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleCloseNotification = () => {
    setNotification(null);
  };

  const getCurrentPageTitle = () => {
    const currentItem = menuItems.find(item => item.path === location.pathname);
    return currentItem ? currentItem.text : 'Административная панель';
  };

  const drawer = (
    <div>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <Box sx={{
            backgroundColor: COLORS.primary,
            borderRadius: '50%',
            p: 1,
            mr: 1.5,
          }}>
            <DashboardIcon sx={{ color: 'white', fontSize: 20 }} />
          </Box>
          <Typography variant="h6" noWrap component="div" sx={{ 
            color: COLORS.primary,
            fontWeight: 600,
          }}>
            Gear Up
          </Typography>
        </Box>
      </Toolbar>
      <Divider />
      <List sx={{ px: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleMenuClick(item.path)}
              sx={{
                borderRadius: 2,
                '&.Mui-selected': {
                  backgroundColor: `${COLORS.primary}15`,
                  '&:hover': {
                    backgroundColor: `${COLORS.primary}25`,
                  },
                },
                '&:hover': {
                  backgroundColor: `${COLORS.primary}08`,
                },
              }}
            >
              <ListItemIcon sx={{ 
                color: location.pathname === item.path ? COLORS.primary : COLORS.muted,
                minWidth: 40,
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                sx={{ 
                  '& .MuiListItemText-primary': {
                    color: location.pathname === item.path ? COLORS.primary : COLORS.text,
                    fontWeight: location.pathname === item.path ? 600 : 400,
                    fontSize: '0.875rem',
                  }
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Box sx={{ flexGrow: 1 }} />
      
      {/* Информация о пользователе в боковой панели */}
      <Box sx={{ p: 2, borderTop: `1px solid ${COLORS.border}` }}>
        <Typography variant="caption" color={COLORS.muted} sx={{ mb: 1, display: 'block' }}>
          Вошел как:
        </Typography>
        <Typography variant="body2" fontWeight={500} color={COLORS.text}>
          {user?.username || user?.email || 'Администратор'}
        </Typography>
        {user?.role && (
          <Typography variant="caption" color={COLORS.muted}>
            {user.role.name || user.role.type || 'Администратор'}
          </Typography>
        )}
      </Box>
    </div>
  );

  // Проверяем аутентификацию
  if (!isAuthenticated) {
    return null; // ProtectedRoute должен обработать это
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: COLORS.surface,
          color: COLORS.text,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          borderBottom: `1px solid ${COLORS.border}`,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            {getCurrentPageTitle()}
          </Typography>
          
          {/* Компонент профиля пользователя */}
          <UserProfile />
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              backgroundColor: COLORS.surface,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              backgroundColor: COLORS.surface,
              borderRight: `1px solid ${COLORS.border}`,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: SPACING.lg / 8,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: COLORS.background,
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        <Box sx={{ width: '100%' }}>
          {children}
        </Box>
      </Box>

      {/* Уведомления */}
      <Snackbar
        open={!!notification}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        {notification && (
          <Alert 
            onClose={handleCloseNotification} 
            severity={notification.type}
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        )}
      </Snackbar>
    </Box>
  );
};

export default AdminLayout;
