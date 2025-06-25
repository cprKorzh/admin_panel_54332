# Аутентификация в Административной Панели Gear Up

## Обзор

Административная панель Gear Up использует безопасную систему аутентификации на основе JWT токенов с проверкой прав администратора.

## Основные компоненты аутентификации

### 1. AuthContext (`src/contexts/AuthContext.jsx`)
- Управляет состоянием аутентификации пользователя
- Проверяет права администратора
- Автоматически обновляет токены
- Обрабатывает выход из системы

### 2. ApiService (`src/services/api.js`)
- Обрабатывает все API запросы
- Автоматически добавляет JWT токены к запросам
- Обрабатывает ошибки аутентификации (401)
- Автоматически выходит из системы при истечении токена

### 3. ProtectedRoute (`src/components/auth/ProtectedRoute.jsx`)
- Защищает маршруты от неавторизованного доступа
- Показывает форму входа для неаутентифицированных пользователей
- Отображает загрузку во время проверки аутентификации

### 4. LoginForm (`src/components/auth/LoginForm.jsx`)
- Форма входа в систему
- Проверка статуса сервера
- Валидация данных
- Обработка ошибок входа

### 5. UserProfile (`src/components/auth/UserProfile.jsx`)
- Отображение информации о текущем пользователе
- Меню профиля с возможностью выхода
- Показ роли и прав пользователя

## Процесс аутентификации

### 1. Вход в систему
```javascript
// Пользователь вводит логин и пароль
const response = await apiService.login(identifier, password);

// Проверяется роль пользователя
if (!isAdminUser(response.user)) {
  throw new Error('У вас нет прав администратора');
}

// Токен сохраняется в localStorage и apiService
apiService.setToken(response.jwt);
localStorage.setItem('user', JSON.stringify(response.user));
```

### 2. Проверка прав администратора
```javascript
const isAdminUser = (user) => {
  if (!user?.role) return false;
  
  const adminRoleTypes = ['admin', 'administrator', 'super-admin'];
  const roleType = user.role.type || user.role.name || '';
  
  return adminRoleTypes.includes(roleType.toLowerCase());
};
```

### 3. Автоматическая проверка токена
```javascript
// При загрузке приложения
const token = localStorage.getItem('authToken');
if (token) {
  apiService.setToken(token);
  const currentUser = await apiService.getCurrentUser();
  
  if (!isAdminUser(currentUser)) {
    logout();
  }
}
```

### 4. Обработка истечения токена
```javascript
// В ApiService при получении 401 ошибки
if (response.status === 401) {
  this.setToken(null);
  localStorage.removeItem('user');
  window.location.reload(); // Возврат к форме входа
}
```

## Безопасность

### Защищенные данные
- JWT токены хранятся в localStorage
- Автоматическое удаление при выходе или ошибках
- Проверка прав администратора на каждом запросе

### Обработка ошибок
- Автоматический выход при истечении токена
- Очистка данных при ошибках аутентификации
- Проверка статуса сервера перед входом

### Валидация
- Проверка формата данных входа
- Валидация ответов сервера
- Проверка прав доступа

## Использование в компонентах

### Получение данных пользователя
```javascript
import { useAuth } from '../contexts/AuthContext.jsx';

const MyComponent = () => {
  const { user, isAuthenticated, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Не авторизован</div>;
  }
  
  return (
    <div>
      <p>Привет, {user.username}!</p>
      <button onClick={logout}>Выйти</button>
    </div>
  );
};
```

### Выполнение API запросов
```javascript
import { apiService } from '../services/api.js';
import { useApiError } from '../hooks/useApiError.js';

const MyComponent = () => {
  const { handleApiCall, error, loading } = useApiError();
  
  const fetchData = () => {
    handleApiCall(
      () => apiService.getUsers(),
      {
        onSuccess: (users) => console.log('Users:', users),
        onError: (err) => console.error('Error:', err),
      }
    );
  };
  
  return (
    <div>
      {loading && <div>Загрузка...</div>}
      {error && <div>Ошибка: {error}</div>}
      <button onClick={fetchData}>Загрузить данные</button>
    </div>
  );
};
```

## Настройка сервера

Убедитесь, что на сервере Strapi:

1. **Создан пользователь-администратор**:
   ```
   Логин: admin
   Пароль: 123123
   Роль: Administrator или Super Admin
   ```

2. **Настроены права доступа**:
   - Роль Administrator имеет доступ ко всем API
   - Настроены CORS для фронтенда
   - JWT токены настроены правильно

3. **API эндпоинты доступны**:
   - `/api/auth/local` - вход в систему
   - `/api/users/me` - получение текущего пользователя
   - Все остальные API для управления данными

## Отладка

### Проверка токена
```javascript
// В консоли браузера
console.log('Token:', localStorage.getItem('authToken'));
console.log('User:', JSON.parse(localStorage.getItem('user') || '{}'));
```

### Проверка API запросов
```javascript
// В Network tab браузера проверьте:
// - Наличие Authorization header
// - Статус ответов (200, 401, etc.)
// - Содержимое ответов
```

### Логи аутентификации
```javascript
// В AuthContext включено логирование:
console.log('Login successful:', response);
console.log('Token validation failed:', error);
```

## Возможные проблемы и решения

### 1. "У вас нет прав администратора"
- Проверьте роль пользователя в Strapi
- Убедитесь, что роль называется 'admin', 'administrator' или 'super-admin'

### 2. "Сессия истекла"
- Токен JWT истек
- Войдите в систему заново
- Проверьте настройки времени жизни токена в Strapi

### 3. "Сервер недоступен"
- Проверьте, что Strapi сервер запущен
- Проверьте URL в `.env` файле
- Проверьте CORS настройки

### 4. Бесконечная загрузка
- Проверьте консоль на ошибки
- Проверьте Network tab на неудачные запросы
- Очистите localStorage и попробуйте снова

## Тестирование

Для тестирования аутентификации используйте:

```bash
# Запуск сервера разработки
npm run dev

# Тестовые данные для входа
Логин: admin
Пароль: 123123
```

Убедитесь, что сервер Strapi запущен на `http://localhost:25546`.
