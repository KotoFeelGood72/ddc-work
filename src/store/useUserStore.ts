import { defineStore } from 'pinia';
import axios from 'axios';
import { useRouter } from 'vue-router';

export const useUsersStore = defineStore('user', {
  state: () => ({
    user: null as any,
  }),
  actions: {
    async signIn(user: any) {
      try {
        await axios.post('https://manager.dynamic-devs-collective.ru/wp-json/wp/v2/register/user', user, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.error('Sign in error:', error);
      }
    },
    async login(user: any) {
      const router = useRouter(); // Инициализация роутера внутри метода
      try {
        const response = await axios.post('https://manager.dynamic-devs-collective.ru/wp-json/jwt-auth/v1/token', user, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
        await this.setUser(response.data);

        router.push('/clients?page=1&view=list&count=10');
      } catch (error) {
        console.log('Login error:', error);
      }
    },
    async refreshToken() {
      try {
        const response = await axios.post('https://manager.dynamic-devs-collective.ru/wp-json/jwt-auth/v1/token/refresh', {
          refresh_token: this.user.token,
        });
        this.setUser(response.data);
      } catch (error) {
        console.log('Refresh token error:', error);
      }
    },
    setUser(data: any) {
      this.user = data;
      localStorage.setItem('user', JSON.stringify(data)); 
    },
    clearUser() {
      this.$reset();  
      localStorage.removeItem('user');
      const router = useRouter(); 
      router.push('/');
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
