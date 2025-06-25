import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Grid,
} from '@mui/material';
import { PersonAdd as PersonAddIcon } from '@mui/icons-material';
import { apiService } from '../../services/api.js';
import { COLORS, SPACING } from '../../constants/styles.js';
import { StudyStatus } from '../../types/index.js';

const UserRegistration = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
    surname: '',
    phone: '',
    adress: '', // Сохраняем оригинальное написание из API
    study_status: '',
    blocked: false,
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.email || !formData.password) {
      setError('Заполните обязательные поля: имя пользователя, email и пароль');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Подготавливаем данные для регистрации
      const registrationData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        name: formData.name || null,
        surname: formData.surname || null,
        phone: formData.phone || null,
        adress: formData.adress || null,
        study_status: formData.study_status || null,
        role: 'student', // Устанавливаем роль student по умолчанию
        blocked: formData.blocked,
      };

      await apiService.createUser(registrationData);
      
      setSuccess(true);
      setFormData({
        username: '',
        email: '',
        password: '',
        name: '',
        surname: '',
        phone: '',
        adress: '',
        study_status: '',
        blocked: false,
      });
      
      // Скрываем сообщение об успехе через 3 секунды
      setTimeout(() => setSuccess(false), 3000);
      
    } catch (err) {
      setError('Ошибка при регистрации пользователя: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ p: SPACING.xl / 8, width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: SPACING.lg / 8 }}>
        <PersonAddIcon sx={{ mr: 1, color: COLORS.primary }} />
        <Typography variant="h5" component="h1" fontWeight={600}>
          Регистрация нового пользователя
        </Typography>
      </Box>

      {success && (
        <Alert severity="success" sx={{ mb: SPACING.lg / 8 }}>
          Пользователь успешно зарегистрирован!
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: SPACING.lg / 8 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Обязательные поля */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label="Имя пользователя"
              name="username"
              value={formData.username}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              type="email"
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              type="password"
              label="Пароль"
              name="password"
              value={formData.password}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>

          {/* Дополнительные поля */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Имя"
              name="name"
              value={formData.name}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Фамилия"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Телефон"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Адрес"
              name="adress"
              value={formData.adress}
              onChange={handleChange}
              variant="outlined"
              multiline
              rows={2}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Статус обучения</InputLabel>
              <Select
                name="study_status"
                value={formData.study_status}
                onChange={handleChange}
                label="Статус обучения"
              >
                <MenuItem value="">
                  <em>Не выбран</em>
                </MenuItem>
                {Object.values(StudyStatus).map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.blocked}
                  onChange={handleChange}
                  name="blocked"
                  color="warning"
                />
              }
              label="Заблокировать пользователя"
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: SPACING.xl / 8, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            sx={{
              backgroundColor: COLORS.primary,
              '&:hover': {
                backgroundColor: COLORS.primary,
                opacity: 0.9,
              },
              borderRadius: 3,
              px: 4,
              py: 1.5,
              fontWeight: 600,
            }}
          >
            {loading ? 'Регистрация...' : 'Зарегистрировать пользователя'}
          </Button>
        </Box>
      </Box>
      </Paper>
    </Box>
  );
};

export default UserRegistration;
