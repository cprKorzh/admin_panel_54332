import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  DirectionsCar as DrivingIcon,
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ru } from 'date-fns/locale';
import { apiService } from '../../services/api.js';
import { COLORS, SPACING } from '../../constants/styles.js';
import { DrivingType, DrivingStatus } from '../../types/index.js';

const DrivingManagement = () => {
  const [drivings, setDrivings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDriving, setEditingDriving] = useState(null);
  const [formData, setFormData] = useState({
    driving_type: '',
    start: new Date(),
    end: null,
    driving_status: DrivingStatus.IN_PROGRESS,
    users_permissions_user: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [drivingsResponse, usersResponse] = await Promise.all([
        apiService.getDrivings(),
        apiService.getUsers(),
      ]);
      
      setDrivings(drivingsResponse.data || []);
      setUsers(usersResponse || []);
      setError(null);
    } catch (err) {
      setError('Ошибка при загрузке данных: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (driving = null) => {
    if (driving) {
      setEditingDriving(driving);
      setFormData({
        driving_type: driving.driving_type,
        start: new Date(driving.start),
        end: driving.end ? new Date(driving.end) : null,
        driving_status: driving.driving_status,
        users_permissions_user: driving.users_permissions_user?.id || '',
      });
    } else {
      setEditingDriving(null);
      setFormData({
        driving_type: '',
        start: new Date(),
        end: null,
        driving_status: DrivingStatus.IN_PROGRESS,
        users_permissions_user: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingDriving(null);
  };

  const handleSubmit = async () => {
    try {
      const submitData = {
        ...formData,
        start: formData.start.toISOString(),
        end: formData.end ? formData.end.toISOString() : null,
        users_permissions_user: formData.users_permissions_user || null,
      };

      if (editingDriving) {
        await apiService.updateDriving(editingDriving.id, submitData);
      } else {
        await apiService.createDriving(submitData);
      }

      await fetchData();
      handleCloseDialog();
    } catch (err) {
      setError('Ошибка при сохранении: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту запись?')) {
      try {
        await apiService.deleteDriving(id);
        await fetchData();
      } catch (err) {
        setError('Ошибка при удалении: ' + err.message);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case DrivingStatus.PASSED:
        return 'success';
      case DrivingStatus.FAILED:
        return 'error';
      default:
        return 'info';
    }
  };

  const getUserName = (user) => {
    if (!user) return 'Не назначен';
    return user.name && user.surname ? `${user.name} ${user.surname}` : user.username;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ p: SPACING.lg / 8, width: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: SPACING.lg / 8 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <DrivingIcon sx={{ mr: 1, color: COLORS.primary }} />
            <Typography variant="h5" component="h1" fontWeight={600}>
              Управление записями на вождение
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{
              backgroundColor: COLORS.primary,
              '&:hover': { backgroundColor: COLORS.primary, opacity: 0.9 },
            }}
          >
            Добавить запись
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: SPACING.lg / 8 }}>
            {error}
          </Alert>
        )}

        <TableContainer sx={{ width: '100%' }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Тип вождения</TableCell>
                <TableCell>Ученик</TableCell>
                <TableCell>Начало</TableCell>
                <TableCell>Окончание</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {drivings.map((driving) => (
                <TableRow key={driving.id} hover>
                  <TableCell>{driving.id}</TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {driving.driving_type}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {getUserName(driving.users_permissions_user)}
                  </TableCell>
                  <TableCell>
                    {new Date(driving.start).toLocaleString('ru-RU')}
                  </TableCell>
                  <TableCell>
                    {driving.end ? new Date(driving.end).toLocaleString('ru-RU') : 'Не указано'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={driving.driving_status}
                      size="small"
                      color={getStatusColor(driving.driving_status)}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Редактировать">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleOpenDialog(driving)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Удалить">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(driving.id)}
                        >
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

        {drivings.length === 0 && (
          <Box sx={{ p: SPACING.xl / 8, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Записи на вождение не найдены
            </Typography>
          </Box>
        )}

        {/* Dialog для создания/редактирования */}
        <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingDriving ? 'Редактировать запись' : 'Добавить запись на вождение'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Тип вождения</InputLabel>
                  <Select
                    value={formData.driving_type}
                    onChange={(e) => setFormData({ ...formData, driving_type: e.target.value })}
                    label="Тип вождения"
                  >
                    {Object.values(DrivingType).map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Ученик</InputLabel>
                  <Select
                    value={formData.users_permissions_user}
                    onChange={(e) => setFormData({ ...formData, users_permissions_user: e.target.value })}
                    label="Ученик"
                  >
                    <MenuItem value="">
                      <em>Не назначен</em>
                    </MenuItem>
                    {users.map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        {getUserName(user)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <DateTimePicker
                  label="Начало"
                  value={formData.start}
                  onChange={(newValue) => setFormData({ ...formData, start: newValue })}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <DateTimePicker
                  label="Окончание (необязательно)"
                  value={formData.end}
                  onChange={(newValue) => setFormData({ ...formData, end: newValue })}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Статус</InputLabel>
                  <Select
                    value={formData.driving_status}
                    onChange={(e) => setFormData({ ...formData, driving_status: e.target.value })}
                    label="Статус"
                  >
                    {Object.values(DrivingStatus).map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Отмена</Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              sx={{
                backgroundColor: COLORS.primary,
                '&:hover': { backgroundColor: COLORS.primary, opacity: 0.9 },
              }}
            >
              {editingDriving ? 'Сохранить' : 'Создать'}
            </Button>
          </DialogActions>
        </Dialog>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

export default DrivingManagement;
