<template>
  <div class="admin">
    <adminSidebar />
    <div class="main">
      <AdminHeaderVue />
      <div class="content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AdminHeaderVue from "@/components/header/AdminHeader.vue";
import adminSidebar from "@/components/sidebars/admin-sidebar.vue";
</script>

<style scoped lang="scss">
.main {
  flex-grow: 1;
  min-height: 100%;
  height: 100%;
}
.admin {
  @include flex-start;
  align-items: flex-start;
  &.fixed {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
  }
}
.content {
  min-height: calc(100vh - 70px);
  padding: 40px;
  background-color: $bg-color-tertiary;

  @include bp($point_4) {
    padding: 20px 10px;
  }
}
</style>
