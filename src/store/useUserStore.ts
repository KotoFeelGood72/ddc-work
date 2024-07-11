import { defineStore, storeToRefs } from 'pinia';
import axios from 'axios';

export const useUsersStore = defineStore('global/user', {
  state: () => ({
    user: {
      access_token: '',
      refresh_token: '',
      info: {
        role: 'unknown',
      }
    }
  }),
  actions: {
    async signIn(user: any, type: any) {
      if (type === 'user') {
        try {
          const response = await axios.post('https://manager.dynamic-devs-collective.ru/wp-json/wp/v2/register/user', user, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          // Process response if needed
          console.log(response.data);
        } catch (error) {
          console.error('Sign in error:', error);
        }
      }
    },
    async login(user: any) {
      try {
        const response = await axios.post('https://manager.dynamic-devs-collective.ru/wp-json/jwt-auth/v1/token', user, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
        this.setUser(response.data);
      } catch (error) {
        console.log('Login error:', error);
      }
    },
    async refreshToken() {
      try {
        const response = await axios.post('https://manager.dynamic-devs-collective.ru/wp-json/jwt-auth/v1/token/refresh', {
          refresh_token: this.user.refresh_token,
        });
        this.setUser(response.data);
      } catch (error) {
        console.log('Refresh token error:', error);
      }
    },
    setUser(data: any) {
      this.user.access_token = data.token;
      this.user.refresh_token = data.refresh_token;
      this.user.info = data.user_info || this.user.info;
      localStorage.setItem('user', JSON.stringify(this.user));
    },
    clearUser() {
      this.user.access_token = '';
      this.user.refresh_token = '';
      this.user.info = { role: 'unknown' };
      localStorage.removeItem('user');
    },
    loadUserFromLocalStorage() {
      const userData = localStorage.getItem('user');
      if (userData) {
        this.user = JSON.parse(userData);
      }
    }
  },
  persist: true,
});

export const useUsersStoreRefs = () => storeToRefs(useUsersStore());

// Load user from local storage on store initialization
const store = useUsersStore();
store.loadUserFromLocalStorage();
