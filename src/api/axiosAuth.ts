import axios from 'axios';

const authInstance = axios.create({
  baseURL: 'https://manager.dynamic-devs-collective.ru/wp-json/jwt-auth/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default authInstance;
