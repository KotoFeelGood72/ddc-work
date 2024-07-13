<template>
  <div class="admin-header">
    <div class="admin__main">
      <div class="row-start">
        <heading :title="route?.meta?.title" :level="3" :size="8" />
      </div>
      <div class="row-end">
        <notificationBtn />
        <avatar @click="clearUser()" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import avatar from "../ui/people/avatar.vue";
import notificationBtn from "../ui/buttons/notification-btn.vue";
import { useUsersStore } from "@/store/useUserStore";
import { useRoute } from "vue-router";

const { clearUser } = useUsersStore();
const route = useRoute();
</script>

<style scoped lang="scss">
.admin-header {
  padding: 10px 20px;
  height: 70px;
  border-bottom: 1px solid #ebecf0;
  .admin__main {
    @include flex-space;
    // background-color: $bg-color-tertiary;
    // border-radius: 15px;
    padding: 10px 20px;
  }
}

.row-end {
  @include flex-end;
  gap: 20px;
}
</style>
