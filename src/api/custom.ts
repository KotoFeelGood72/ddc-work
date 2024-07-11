import axios from 'axios';
import { useUsersStore } from '@/store/useUserStore';

const customInstance = axios.create({
  baseURL: 'https://manager.dynamic-devs-collective.ru/wp-json/custom/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

customInstance.interceptors.request.use((config: any) => {
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

customInstance.interceptors.response.use(
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

export default customInstance;
