<template>
  <component :is="layoutComponent">
    <router-view />
  </component>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import AdminLayout from "@/layouts/AdminLayout.vue";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import EmptyLayout from "@/layouts/EmptyLayout.vue";

const route = useRoute();

const layoutComponent = computed(() => {
  switch (route.meta.layout) {
    case "Admin":
      return AdminLayout;
    case "Empty":
      return EmptyLayout;
    default:
      return DefaultLayout;
  }
});
</script>

<style scoped lang="scss">
/* Your layout-specific styles here */
</style>
