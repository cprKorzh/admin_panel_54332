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
  Quiz as ExamIcon,
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ru } from 'date-fns/locale';
import { apiService } from '../../services/api.js';
import { COLORS, SPACING } from '../../constants/styles.js';
import { ExamType, ExamStatus } from '../../types/index.js';

const ExamManagement = () => {
  const [exams, setExams] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [formData, setFormData] = useState({
    exam_type: '',
    start: new Date(),
    exam_status: ExamStatus.IN_PROGRESS,
    users_permissions_user: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [examsResponse, usersResponse] = await Promise.all([
        apiService.getExams(),
        apiService.getUsers(),
      ]);
      
      setExams(examsResponse.data || []);
      setUsers(usersResponse || []);
      setError(null);
    } catch (err) {
      setError('Ошибка при загрузке данных: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (exam = null) => {
    if (exam) {
      setEditingExam(exam);
      setFormData({
        exam_type: exam.exam_type,
        start: new Date(exam.start),
        exam_status: exam.exam_status,
        users_permissions_user: exam.users_permissions_user?.id || '',
      });
    } else {
      setEditingExam(null);
      setFormData({
        exam_type: '',
        start: new Date(),
        exam_status: ExamStatus.IN_PROGRESS,
        users_permissions_user: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingExam(null);
  };

  const handleSubmit = async () => {
    try {
      const submitData = {
        ...formData,
        start: formData.start.toISOString(),
        users_permissions_user: formData.users_permissions_user || null,
      };

      if (editingExam) {
        await apiService.updateExam(editingExam.id, submitData);
      } else {
        await apiService.createExam(submitData);
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
        await apiService.deleteExam(id);
        await fetchData();
      } catch (err) {
        setError('Ошибка при удалении: ' + err.message);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case ExamStatus.PASSED:
        return 'success';
      case ExamStatus.FAILED:
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
            <ExamIcon sx={{ mr: 1, color: COLORS.primary }} />
            <Typography variant="h5" component="h1" fontWeight={600}>
              Управление записями на экзамены
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
                <TableCell>Тип экзамена</TableCell>
                <TableCell>Ученик</TableCell>
                <TableCell>Дата и время</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {exams.map((exam) => (
                <TableRow key={exam.id} hover>
                  <TableCell>{exam.id}</TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {exam.exam_type}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {getUserName(exam.users_permissions_user)}
                  </TableCell>
                  <TableCell>
                    {new Date(exam.start).toLocaleString('ru-RU')}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={exam.exam_status}
                      size="small"
                      color={getStatusColor(exam.exam_status)}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Редактировать">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleOpenDialog(exam)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Удалить">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(exam.id)}
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

        {exams.length === 0 && (
          <Box sx={{ p: SPACING.xl / 8, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Записи на экзамены не найдены
            </Typography>
          </Box>
        )}

        {/* Dialog для создания/редактирования */}
        <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingExam ? 'Редактировать запись' : 'Добавить запись на экзамен'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Тип экзамена</InputLabel>
                  <Select
                    value={formData.exam_type}
                    onChange={(e) => setFormData({ ...formData, exam_type: e.target.value })}
                    label="Тип экзамена"
                  >
                    {Object.values(ExamType).map((type) => (
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
                  label="Дата и время экзамена"
                  value={formData.start}
                  onChange={(newValue) => setFormData({ ...formData, start: newValue })}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Статус</InputLabel>
                  <Select
                    value={formData.exam_status}
                    onChange={(e) => setFormData({ ...formData, exam_status: e.target.value })}
                    label="Статус"
                  >
                    {Object.values(ExamStatus).map((status) => (
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
              {editingExam ? 'Сохранить' : 'Создать'}
            </Button>
          </DialogActions>
        </Dialog>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

export default ExamManagement;
