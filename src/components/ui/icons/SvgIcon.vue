<template>
  <svg :class="`icon-${icon}`">
    <use :xlink:href="`#icon-${icon}`"></use>
  </svg>
</template>

<script lang="ts" setup>
import { defineProps } from "vue";

defineProps<{
  icon?: string;
}>();
</script>

<style scoped>
/* добавьте стили для вашего SVG при необходимости */
</style>
