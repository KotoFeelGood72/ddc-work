import axios from "axios";

// Функция для получения токена из localStorage
const getToken = () => {
  const userData = localStorage.getItem("user");
  if (userData) {
    const parsedUser = JSON.parse(userData);
    return parsedUser?.auth?.jwt_token || null; // Извлекаем токен из объекта auth
  }
  return null;
};

// Настройка основного API
const api = axios.create({
  baseURL: '/api/',
});

// Интерсептор для добавления токена в заголовок Authorization
const requestInterceptor = (config: any) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; 
  }
  return config;
};

// Обработка ошибок запроса
const errorInterceptor = (error: any) => Promise.reject(error);

// Устанавливаем интерсептор запроса
api.interceptors.request.use(requestInterceptor, errorInterceptor);

// Интерсептор для обработки успешных ответов
const responseInterceptor = (response: any) => response;

// Обработка ошибок ответа
const responseErrorInterceptor = (error: any) => {
  if (error.response && error.response.status === 401) {
    // Удаляем данные пользователя при неавторизованном статусе
    localStorage.removeItem("user");
    window.location.href = "/login"; // Перенаправляем на страницу входа
  }
  return Promise.reject(error);
};

// Устанавливаем интерсепторы ответа
api.interceptors.response.use(responseInterceptor, responseErrorInterceptor);

export { api };
