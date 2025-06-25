import React, { useState } from 'react';
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  AccountCircle,
  Logout,
  AdminPanelSettings,
  Person,
  Email,
  AccessTime,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { COLORS } from '../../constants/styles.js';

const UserProfile = () => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  const getUserInitials = () => {
    if (!user) return 'A';
    
    const name = user.username || user.email || 'Admin';
    return name.charAt(0).toUpperCase();
  };

  const getUserDisplayName = () => {
    if (!user) return 'Администратор';
    
    return user.username || user.email || 'Администратор';
  };

  const getUserRole = () => {
    if (!user?.role) return 'Администратор';
    
    const role = user.role;
    const roleNames = {
      'admin': 'Администратор',
      'administrator': 'Администратор',
      'super-admin': 'Супер Администратор',
    };
    
    return roleNames[role.type] || roleNames[role.name] || role.name || 'Администратор';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Неизвестно';
    
    try {
      return new Date(dateString).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return 'Неизвестно';
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{ 
          ml: 2,
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        }}
        aria-controls={open ? 'account-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <Avatar
          sx={{
            width: 32,
            height: 32,
            backgroundColor: COLORS.primary,
            fontSize: '0.875rem',
            fontWeight: 600,
          }}
        >
          {getUserInitials()}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 3,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            minWidth: 280,
            borderRadius: 2,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* Информация о пользователе */}
        <Box sx={{ px: 2, py: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                backgroundColor: COLORS.primary,
                mr: 1.5,
              }}
            >
              {getUserInitials()}
            </Avatar>
            <Box>
              <Typography variant="subtitle2" fontWeight={600}>
                {getUserDisplayName()}
              </Typography>
              <Chip
                icon={<AdminPanelSettings />}
                label={getUserRole()}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ 
                  height: 20,
                  fontSize: '0.75rem',
                  '& .MuiChip-icon': {
                    fontSize: '0.875rem',
                  },
                }}
              />
            </Box>
          </Box>
        </Box>

        <Divider />

        {/* Детали пользователя */}
        <Box sx={{ px: 2, py: 1 }}>
          {user?.email && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Email sx={{ fontSize: 16, color: COLORS.muted, mr: 1 }} />
              <Typography variant="body2" color={COLORS.muted}>
                {user.email}
              </Typography>
            </Box>
          )}
          
          {user?.createdAt && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AccessTime sx={{ fontSize: 16, color: COLORS.muted, mr: 1 }} />
              <Typography variant="body2" color={COLORS.muted}>
                Создан: {formatDate(user.createdAt)}
              </Typography>
            </Box>
          )}
        </Box>

        <Divider />

        {/* Действия */}
        <MenuItem onClick={handleLogout} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <Logout fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>
            <Typography color="error">Выйти</Typography>
          </ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default UserProfile;
