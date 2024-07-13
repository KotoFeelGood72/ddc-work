<template>
  <div class="pagination">
    <div class="pagination__btn">
      <IconsBtn
        icon="bytesize:chevron-left"
        iconColor="white"
        iconHoverColor="white"
        iconSize="16px"
        @onClick="emit('prevPage')"
        size="normal"
        color="#377dff"
      />
      <IconsBtn
        icon="bytesize:chevron-right"
        iconColor="white"
        iconHoverColor="white"
        iconSize="16px"
        @onClick="emit('nextPage')"
        size="normal"
        color="#377dff"
      />
    </div>
    <div class="total-page">Страница: {{ currentPage }} из {{ totalPages }}</div>
  </div>
</template>

<script setup lang="ts">
import IconsBtn from "./IconsBtn.vue";
import { defineEmits } from "vue";

const emit = defineEmits(["prevPage", "nextPage"]);

defineProps<{
  totalPages?: number;
  currentPage?: number;
}>();
</script>

<style scoped lang="scss">
.pagination {
  @include flex-space;
}

.pagination__btn {
  @include flex-start;
  gap: 10px;
}

.total-page {
  font-size: $body-2;
}
</style>
