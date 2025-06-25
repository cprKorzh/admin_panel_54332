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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Alert,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ru } from 'date-fns/locale';
import { apiService } from '../../services/api.js';
import { COLORS, SPACING } from '../../constants/styles.js';

const TimetableManagement = () => {
  const [timetables, setTimetables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTimetable, setEditingTimetable] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start: new Date(),
    end: new Date(Date.now() + 60 * 60 * 1000), // +1 час по умолчанию
  });

  useEffect(() => {
    fetchTimetables();
  }, []);

  const fetchTimetables = async () => {
    try {
      setLoading(true);
      const response = await apiService.getTimetables();
      setTimetables(response.data || []);
      setError(null);
    } catch (err) {
      setError('Ошибка при загрузке расписания: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (timetable = null) => {
    if (timetable) {
      setEditingTimetable(timetable);
      setFormData({
        title: timetable.title,
        description: timetable.description || '',
        start: new Date(timetable.start),
        end: new Date(timetable.end),
      });
    } else {
      setEditingTimetable(null);
      setFormData({
        title: '',
        description: '',
        start: new Date(),
        end: new Date(Date.now() + 60 * 60 * 1000),
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingTimetable(null);
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      setError('Заполните название события');
      return;
    }

    if (formData.start >= formData.end) {
      setError('Время окончания должно быть позже времени начала');
      return;
    }

    try {
      const submitData = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        start: formData.start.toISOString(),
        end: formData.end.toISOString(),
      };

      if (editingTimetable) {
        await apiService.updateTimetable(editingTimetable.id, submitData);
      } else {
        await apiService.createTimetable(submitData);
      }

      await fetchTimetables();
      handleCloseDialog();
      setError(null);
    } catch (err) {
      setError('Ошибка при сохранении: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить это событие?')) {
      try {
        await apiService.deleteTimetable(id);
        await fetchTimetables();
      } catch (err) {
        setError('Ошибка при удалении: ' + err.message);
      }
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDuration = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffMs = endDate - startDate;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `${diffHours}ч ${diffMinutes}м`;
    }
    return `${diffMinutes}м`;
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
            <ScheduleIcon sx={{ mr: 1, color: COLORS.primary }} />
            <Typography variant="h5" component="h1" fontWeight={600}>
              Управление расписанием
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
            Добавить событие
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
                <TableCell>Название</TableCell>
                <TableCell>Описание</TableCell>
                <TableCell>Начало</TableCell>
                <TableCell>Окончание</TableCell>
                <TableCell>Длительность</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {timetables.map((timetable) => (
                <TableRow key={timetable.id} hover>
                  <TableCell>{timetable.id}</TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {timetable.title}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {timetable.description || 'Нет описания'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDateTime(timetable.start)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDateTime(timetable.end)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {getDuration(timetable.start, timetable.end)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Редактировать">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleOpenDialog(timetable)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Удалить">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(timetable.id)}
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

        {timetables.length === 0 && (
          <Box sx={{ p: SPACING.xl / 8, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              События в расписании не найдены
            </Typography>
          </Box>
        )}

        {/* Dialog для создания/редактирования */}
        <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingTimetable ? 'Редактировать событие' : 'Добавить событие в расписание'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Название события"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  variant="outlined"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Описание (необязательно)"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  variant="outlined"
                  multiline
                  rows={3}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <DateTimePicker
                  label="Начало события"
                  value={formData.start}
                  onChange={(newValue) => setFormData({ ...formData, start: newValue })}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <DateTimePicker
                  label="Окончание события"
                  value={formData.end}
                  onChange={(newValue) => setFormData({ ...formData, end: newValue })}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
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
              {editingTimetable ? 'Сохранить' : 'Создать'}
            </Button>
          </DialogActions>
        </Dialog>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

export default TimetableManagement;
