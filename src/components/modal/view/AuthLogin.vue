<template>
  <div>
    <input v-model="username" placeholder="Username" />
    <input v-model="password" type="password" placeholder="Password" />
    <button @click="login">Login</button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useUsersStore } from "@/store/useUserStore";

const username = ref("");
const password = ref("");
const userStore = useUsersStore();

const login = async () => {
  await userStore.login({ username: username.value, password: password.value });
};
</script>
