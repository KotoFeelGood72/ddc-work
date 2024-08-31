import axios from 'axios';
import { useUsersStore } from '@/store/useUserStore';

const wpInstance = axios.create({
  baseURL: 'https://manager.dynamic-devs-collective.ru/wp-json/wp/v2',
  headers: {
    'Content-Type': 'application/json',
  },
});

wpInstance.interceptors.request.use((config: any) => {
  const userStore = useUsersStore();
  const token = userStore.users.token;

  if (token) {
    if (!config.headers) {
      config.headers = {};
    }
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

wpInstance.interceptors.response.use(
  (response: any) => {
    return response;
  },
  async (error) => {
    const userStore = useUsersStore();

    if (error.response && error.response.status === 401) {
      try {
        // Пробуем обновить токен
        await userStore.refreshToken();
        
        // Повторяем оригинальный запрос с новым токеном
        const originalRequest = error.config;
        const newToken = userStore.users.token;
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return wpInstance(originalRequest);
      } catch (refreshError) {
        // Не удалось обновить токен, очищаем данные пользователя
        userStore.clearUser();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default wpInstance;
