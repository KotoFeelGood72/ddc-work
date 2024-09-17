import axios from "axios";
import { useUsersStore } from "@/store/useUserStore";

const wpInstance = axios.create({
  baseURL: "/api/wp/v2",
  headers: {
    "Content-Type": "application/json",
  },
  proxy: {
    host: 'localhost', // Прокси сервер
    port: 8080,        // Порт прокси-сервера
    protocol: 'http',
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
        await userStore.refreshToken();
<<<<<<< HEAD

        // Повторяем оригинальный запрос с новым токеном
=======
>>>>>>> 60cb0e6fce1462b0b9bfe4fdb38bc99da0164212
        const originalRequest = error.config;
        const newToken = userStore.users.token;
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return wpInstance(originalRequest);
      } catch (refreshError) {
        userStore.clearUser();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default wpInstance;
