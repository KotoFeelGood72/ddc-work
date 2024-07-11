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
  const token = userStore.user.access_token;

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
  (error) => {
    if (error.response && error.response.status === 401) {
      const userStore = useUsersStore();
      userStore.clearUser();
    }
    return Promise.reject(error);
  }
);

export default wpInstance;
