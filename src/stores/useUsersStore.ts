<<<<<<< HEAD:src/store/useUserStore.ts
import { defineStore, storeToRefs } from "pinia";
import { api } from "@/api/api";
import { useRouter } from "vue-router";
=======
import { defineStore, storeToRefs } from 'pinia';
import axios from 'axios';
import { api } from '@/api/api';
>>>>>>> 59468546baa606473be359619aac9018a2dd2e6d:src/stores/useUsersStore.ts

export const useUsersStore = defineStore("user", {
  state: () => ({
    users: null as any,
    auth: null as string | null
  }),
  actions: {
    async signIn(user: any) {
      try {
        await api.post("/wp-json/wp/v2/register/user", user, {
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        console.error("Sign in error:", error);
      }
    },
    async login(user: any) {
<<<<<<< HEAD:src/store/useUserStore.ts
      const router = useRouter();
      try {
        const response = await api.post("/wp-json/api/v1/token", user, {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
=======
      // const router = useRouter(); 
      try {
        const response = await api.post('/wp-json/api/v1/token', user, {
>>>>>>> 59468546baa606473be359619aac9018a2dd2e6d:src/stores/useUsersStore.ts
        });
        this.auth = response.data

<<<<<<< HEAD:src/store/useUserStore.ts
        await router.push("/clients?page=1&view=list&count=10");
=======
        // await router.push('/clients?page=1&view=list&count=10');
>>>>>>> 59468546baa606473be359619aac9018a2dd2e6d:src/stores/useUsersStore.ts
      } catch (error) {
        console.log("Login error:", error);
      }
    },
    async refreshToken() {
      try {
<<<<<<< HEAD:src/store/useUserStore.ts
        const response = await api.post(
          "/wp-json/jwt-auth/v1/token/validate",
          {},
          {
            headers: {
              Authorization: `Bearer ${this.users.token}`,
            },
          }
        );
        console.log(response.data);
=======
        const response = await api.get('/wp-json/api/v1/token-validate');
        console.log(response.data)
>>>>>>> 59468546baa606473be359619aac9018a2dd2e6d:src/stores/useUsersStore.ts
      } catch (error) {
        console.log("Refresh token error:", error);
      }
    },
    async setUser(data: any) {
      this.users = data;
      localStorage.setItem("user", JSON.stringify(data));
    },
    async clearUser() {
      this.$reset();
      localStorage.removeItem("user");
    },
    // async fetchUserInfo() {
    //   if (this.users) {
    //     await this.refreshToken();
    //     try {
    //       const response = await axios.get("/wp-json/wp/v2/users/me", {
    //         headers: {
    //           Authorization: `Bearer ${this.users.token}`,
    //         },
    //       });
    //       this.setUser({ ...this.users, userInfo: response.data });
    //     } catch (error) {
    //       console.error("Failed to fetch user info:", error);
    //     }
    //   }
    // },

<<<<<<< HEAD:src/store/useUserStore.ts
    loadUserFromLocalStorage() {
      const userData = localStorage.getItem("user");
      if (userData) {
        this.users = JSON.parse(userData);
=======
        await this.refreshToken()
        try {
          const response = await axios.get('/wp-json/wp/v2/users/me', {
            headers: {
              Authorization: `Bearer ${this.users.token}`,
            },
          });
          this.setUser({ ...this.users, userInfo: response.data });
        } catch (error) {
          console.error('Failed to fetch user info:', error);
        }
>>>>>>> 59468546baa606473be359619aac9018a2dd2e6d:src/stores/useUsersStore.ts
      }
    },
  },
  persist: true,
});

export const useUsersStoreRefs = () => storeToRefs(useUsersStore());
