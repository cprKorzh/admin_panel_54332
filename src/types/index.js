// User types (расширенная версия из mobile_client)
export const UserStatus = {
  ACTIVE: 'active',
  BLOCKED: 'blocked',
  PENDING: 'pending',
};

export const StudyStatus = {
  NOT_STARTED: 'Не начато',
  IN_PROGRESS: 'В процессе',
  COMPLETED: 'Завершено',
  SUSPENDED: 'Приостановлено',
};

// Driving types
export const DrivingType = {
  SIMULATOR: 'Симулятор',
  AUTODROME: 'Автодром',
  CITY: 'Город',
};

export const DrivingStatus = {
  IN_PROGRESS: 'В процессе',
  PASSED: 'Пройдено',
  FAILED: 'Не пройдено',
};

// Exam types
export const ExamType = {
  TESTING: 'Тестирование',
  AUTODROME: 'Автодром',
  CITY: 'Город',
};

export const ExamStatus = {
  IN_PROGRESS: 'В процессе',
  PASSED: 'Сдан',
  FAILED: 'Не сдан',
};

// API Response structure (из mobile_client)
export const createApiResponse = (data, meta = null) => ({
  data,
  meta,
});

export const createAuthResponse = (jwt, user) => ({
  jwt,
  user,
});
