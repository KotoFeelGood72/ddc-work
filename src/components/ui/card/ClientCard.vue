<template>
  <div class="card">
    <div class="name">{{ client.name }}</div>
    <div class="segments">{{ client.segment }}</div>
    <div class="address"></div>
    <div class="phone"></div>
    <div class="website"></div>
    <div class="email"></div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  client: any;
}>();
</script>
