<template>
  <div class="admin-sidebar">
    <ul class="nav">
      <li v-for="(link, i) in AdminNav" :key="'admin-nav-item-' + i">
        <router-link :to="link.url">
          <div class="nav-link__icon">
            <svg-icon :name="link.icon" />
          </div>
          <p>{{ link.name }}</p>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { AdminNav } from "@/consts/AdminNav";
</script>

<style scoped lang="scss">
.admin-sidebar {
  min-height: 100vh;
  height: 100%;
  border-right: 1px solid $bg-color-secondary;
  min-width: 270px;
  padding: 30px 20px;
}

.nav {
  list-style: none;
  @include flex-start;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  li {
    width: 100%;
    a {
      width: 100%;
      @include flex-start;
      background-color: $bg-color-tertiary;
      padding: 14px 20px;
      border-radius: 15px;
      gap: 10px;
      color: $text-color-secondary;
      text-decoration: none;
      transition: all 0.3s ease-in-out;
      &:hover {
        background-color: $bg-color-secondary;
      }
    }
  }
}
</style>
