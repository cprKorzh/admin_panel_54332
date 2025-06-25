import { API_CONFIG } from '../constants/api.js';

class ApiService {
    constructor() {
        this.baseURL = API_CONFIG.BASE_URL;
        this.token = localStorage.getItem('authToken');
        
        // Логируем URL для отладки
        console.log('API Base URL:', this.baseURL);
    }

    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('authToken', token);
        } else {
            localStorage.removeItem('authToken');
        }
    }

    getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        return headers;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            ...options,
            headers: {
                ...this.getHeaders(),
                ...options.headers,
            },
        };

        try {
            const response = await fetch(url, config);

            // Обработка ошибок аутентификации
            if (response.status === 401) {
                // Токен недействителен или истек
                this.setToken(null);
                
                // Очищаем данные пользователя
                localStorage.removeItem('user');
                
                // Перезагружаем страницу для возврата к форме входа
                window.location.reload();
                
                throw new Error('Сессия истекла. Необходимо войти заново.');
            }

            if (!response.ok) {
                let errorMessage = `HTTP ${response.status}`;
                
                try {
                    const errorData = await response.json();
                    
                    // Обработка различных форматов ошибок Strapi
                    if (errorData.error) {
                        if (typeof errorData.error === 'string') {
                            errorMessage = errorData.error;
                        } else if (errorData.error.message) {
                            errorMessage = errorData.error.message;
                        } else if (errorData.error.details) {
                            errorMessage = errorData.error.details;
                        }
                    } else if (errorData.message) {
                        errorMessage = errorData.message;
                    } else if (errorData.details) {
                        errorMessage = errorData.details;
                    }
                } catch (parseError) {
                    console.warn('Could not parse error response:', parseError);
                }
                
                throw new Error(errorMessage);
            }

            return await response.json();
        } catch (error) {
            console.error('API Request failed:', {
                url,
                method: config.method || 'GET',
                error: error.message,
            });
            throw error;
        }
    }

    // Auth methods
    async login(identifier, password) {
        try {
            const response = await this.request('/auth/local', {
                method: 'POST',
                body: JSON.stringify({ 
                    identifier: identifier.trim(), 
                    password 
                }),
            });

            if (!response.jwt) {
                throw new Error('Сервер не вернул токен аутентификации');
            }

            if (!response.user) {
                throw new Error('Сервер не вернул данные пользователя');
            }

            // Устанавливаем токен
            this.setToken(response.jwt);
            
            return response;
        } catch (error) {
            // Очищаем токен при ошибке входа
            this.setToken(null);
            
            // Улучшаем сообщения об ошибках
            if (error.message.includes('Invalid identifier or password')) {
                throw new Error('Неверный логин или пароль');
            } else if (error.message.includes('Your account email is not confirmed')) {
                throw new Error('Email не подтвержден');
            } else if (error.message.includes('Your account has been blocked')) {
                throw new Error('Аккаунт заблокирован');
            }
            
            throw error;
        }
    }

    async register(userData) {
        try {
            const response = await this.request('/auth/local/register', {
                method: 'POST',
                body: JSON.stringify(userData),
            });

            if (response.jwt) {
                this.setToken(response.jwt);
            }
            
            return response;
        } catch (error) {
            // Улучшаем сообщения об ошибках регистрации
            if (error.message.includes('Email or Username are already taken')) {
                throw new Error('Email или имя пользователя уже используются');
            }
            
            throw error;
        }
    }

    async logout() {
        this.setToken(null);
        localStorage.removeItem('user');
    }

    async getCurrentUser() {
        if (!this.token) {
            throw new Error('Нет токена аутентификации');
        }
        
        return this.request('/users/me?populate=role');
    }

    // Users methods
    async getUsers(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/users${queryString ? `?${queryString}` : ''}`);
    }

    async createUser(userData) {
        return this.request('/auth/local/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    async updateUser(id, userData) {
        return this.request(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(userData),
        });
    }

    async deleteUser(id) {
        return this.request(`/users/${id}`, {
            method: 'DELETE',
        });
    }

    // Driving methods
    async getDrivings(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/drivings${queryString ? `?${queryString}` : ''}?populate=users_permissions_user`);
    }

    async createDriving(drivingData) {
        return this.request('/drivings', {
            method: 'POST',
            body: JSON.stringify({ data: drivingData }),
        });
    }

    async updateDriving(id, drivingData) {
        return this.request(`/drivings/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ data: drivingData }),
        });
    }

    async deleteDriving(id) {
        return this.request(`/drivings/${id}`, {
            method: 'DELETE',
        });
    }

    // Exams methods
    async getExams(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/exams${queryString ? `?${queryString}` : ''}?populate=users_permissions_user`);
    }

    async createExam(examData) {
        return this.request('/exams', {
            method: 'POST',
            body: JSON.stringify({ data: examData }),
        });
    }

    async updateExam(id, examData) {
        return this.request(`/exams/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ data: examData }),
        });
    }

    async deleteExam(id) {
        return this.request(`/exams/${id}`, {
            method: 'DELETE',
        });
    }

    // Timetable methods
    async getTimetables(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/timetables${queryString ? `?${queryString}` : ''}`);
    }

    async createTimetable(timetableData) {
        return this.request('/timetables', {
            method: 'POST',
            body: JSON.stringify({ data: timetableData }),
        });
    }

    async updateTimetable(id, timetableData) {
        return this.request(`/timetables/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ data: timetableData }),
        });
    }

    async deleteTimetable(id) {
        return this.request(`/timetables/${id}`, {
            method: 'DELETE',
        });
    }

    // Generic CRUD methods
    async get(endpoint) {
        return this.request(endpoint);
    }

    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async delete(endpoint) {
        return this.request(endpoint, {
            method: 'DELETE',
        });
    }

    isAuthenticated() {
        return !!this.token;
    }

    // Метод для проверки здоровья API
    async healthCheck() {
        try {
            const response = await fetch(`${this.baseURL.replace('/api', '')}/`);
            return response.ok;
        } catch (error) {
            console.error('Health check failed:', error);
            return false;
        }
    }
}

export const apiService = new ApiService();
