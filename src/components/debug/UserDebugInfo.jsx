import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from '@mui/material';
import { ExpandMore, BugReport } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { COLORS } from '../../constants/styles.js';

const UserDebugInfo = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return null;
  }

  // Показываем только в режиме разработки
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <Card sx={{ 
      mb: 2, 
      border: `2px solid ${COLORS.warning}`,
      backgroundColor: '#fff3cd',
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <BugReport sx={{ color: COLORS.warning, mr: 1 }} />
          <Typography variant="h6" color={COLORS.warning}>
            Отладочная информация пользователя
          </Typography>
          <Chip 
            label="DEV MODE" 
            size="small" 
            color="warning" 
            sx={{ ml: 2 }}
          />
        </Box>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="subtitle1">
              Данные пользователя
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box component="pre" sx={{ 
              backgroundColor: '#f5f5f5',
              p: 2,
              borderRadius: 1,
              overflow: 'auto',
              fontSize: '0.875rem',
              fontFamily: 'monospace',
            }}>
              {JSON.stringify(user, null, 2)}
            </Box>
          </AccordionDetails>
        </Accordion>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color={COLORS.muted}>
            <strong>ID:</strong> {user.id || 'Не определен'}
          </Typography>
          <Typography variant="body2" color={COLORS.muted}>
            <strong>Username:</strong> {user.username || 'Не определен'}
          </Typography>
          <Typography variant="body2" color={COLORS.muted}>
            <strong>Email:</strong> {user.email || 'Не определен'}
          </Typography>
          <Typography variant="body2" color={COLORS.muted}>
            <strong>Роль:</strong> {user.role ? JSON.stringify(user.role) : 'Не определена'}
          </Typography>
          <Typography variant="body2" color={COLORS.muted}>
            <strong>Создан:</strong> {user.createdAt || 'Не определено'}
          </Typography>
        </Box>

        <Box sx={{ mt: 2, p: 1, backgroundColor: '#e7f3ff', borderRadius: 1 }}>
          <Typography variant="caption" color={COLORS.info}>
            💡 Этот компонент отображается только в режиме разработки. 
            Используйте эту информацию для настройки проверки ролей в AuthContext.jsx
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserDebugInfo;
