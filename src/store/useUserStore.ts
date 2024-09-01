import { defineStore, storeToRefs } from 'pinia';
import axios from 'axios';
import { useRouter } from 'vue-router';

export const useUsersStore = defineStore('user', {
  state: () => ({
    users: {} as any,
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
      const router = useRouter(); 
      try {
        const response = await axios.post('https://manager.dynamic-devs-collective.ru/wp-json/jwt-auth/v1/token', user, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
        await this.setUser(response.data);

        await router.push('/clients?page=1&view=list&count=10');
      } catch (error) {
        console.log('Login error:', error);
      }
    },
    async refreshToken() {
      try {
        const response = await axios.post('https://manager.dynamic-devs-collective.ru/wp-json/jwt-auth/v1/token/refresh', {
          refresh_token: this.users.token,
        });
        this.setUser(response.data);
        console.log(response.data)
      } catch (error) {
        console.log('Refresh token error:', error);
      }
    },
    async setUser(data: any) {
      this.users = data;
      localStorage.setItem('user', JSON.stringify(data)); 
    },
    async clearUser() {
      this.$reset();  
      localStorage.removeItem('user');
    },
    async fetchUserInfo() {
      try {
        const response = await axios.get('https://manager.dynamic-devs-collective.ru/wp-json/wp/v2/users/me', {
          headers: {
            Authorization: `Bearer ${this.users.token}`,
          },
        });
        this.setUser({ ...this.users, userInfo: response.data });
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      }
    },
    
    loadUserFromLocalStorage() {
      const userData = localStorage.getItem('user');
      if (userData) {
        this.users = JSON.parse(userData);
      }
    }
  },
  persist: true,
});


export const useUsersStoreRefs = () => storeToRefs(useUsersStore());