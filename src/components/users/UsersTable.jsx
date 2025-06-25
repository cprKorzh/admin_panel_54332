import React, { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Box,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
  CheckCircle as UnblockIcon,
} from '@mui/icons-material';
import { apiService } from '../../services/api.js';
import UserDebugInfo from '../debug/UserDebugInfo.jsx';
import { COLORS, SPACING } from '../../constants/styles.js';
import { StudyStatus } from '../../types/index.js';

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiService.getUsers({
        populate: 'drivings,exams',
      });
      setUsers(response);
      setError(null);
    } catch (err) {
      setError('Ошибка при загрузке пользователей: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (userId, blocked) => {
    try {
      await apiService.updateUser(userId, { blocked: !blocked });
      await fetchUsers();
    } catch (err) {
      setError('Ошибка при изменении статуса пользователя: ' + err.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case StudyStatus.COMPLETED:
        return COLORS.success;
      case StudyStatus.IN_PROGRESS:
        return COLORS.info;
      case StudyStatus.SUSPENDED:
        return COLORS.warning;
      default:
        return COLORS.muted;
    }
  };

  const formatUserName = (user) => {
    if (user.name && user.surname) {
      return `${user.name} ${user.surname}`;
    }
    return user.username;
  };

  const getDrivingCount = (user) => {
    return user.drivings ? user.drivings.length : 0;
  };

  const getExamCount = (user) => {
    return user.exams ? user.exams.length : 0;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: SPACING.lg / 8 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Отладочная информация о пользователе */}
      <UserDebugInfo />
      
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Box sx={{ p: SPACING.lg / 8 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Все пользователи
          </Typography>
        </Box>
      
      <TableContainer sx={{ width: '100%' }}>
        <Table stickyHeader sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Имя Фамилия</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Статус обучения</TableCell>
              <TableCell>Записи на вождение</TableCell>
              <TableCell>Записи на экзамены</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>{user.id}</TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight={500}>
                    {formatUserName(user)}
                  </Typography>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip
                    label={user.study_status || 'Не указан'}
                    size="small"
                    sx={{
                      backgroundColor: `${getStatusColor(user.study_status)}20`,
                      color: getStatusColor(user.study_status),
                      fontWeight: 500,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {getDrivingCount(user)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {getExamCount(user)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.blocked ? 'Заблокирован' : 'Активен'}
                    size="small"
                    color={user.blocked ? 'error' : 'success'}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Редактировать">
                      <IconButton size="small" color="primary">
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={user.blocked ? 'Разблокировать' : 'Заблокировать'}>
                      <IconButton
                        size="small"
                        color={user.blocked ? 'success' : 'warning'}
                        onClick={() => handleBlockUser(user.id, user.blocked)}
                      >
                        {user.blocked ? <UnblockIcon fontSize="small" /> : <BlockIcon fontSize="small" />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Удалить">
                      <IconButton size="small" color="error">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {users.length === 0 && (
        <Box sx={{ p: SPACING.xl / 8, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Пользователи не найдены
          </Typography>
        </Box>
      )}
      </Paper>
    </Box>
  );
};

export default UsersTable;
