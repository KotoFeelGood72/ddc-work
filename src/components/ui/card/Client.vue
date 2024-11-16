<template>
  <div
    class="card border border-gray-50 py-4 px-5 shadow-sm bg-white flex items-center relative"
  >
    <div class="status bg-violet-300 h-full w-[40px] flex flex-col">
      <p class="rotate-[-90deg]">Новый</p>
    </div>
    <div class="body flex flex-col gap-3">
      <div class="name border-b border-gray-50 pb-2">{{ client.acf.name }}</div>
      <div class="segments border-b border-gray-50 pb-2">
        {{ client.acf.direction }}
      </div>
      <div class="address border-b border-gray-50 pb-2">
        {{ client.acf.phone }}
      </div>
      <div class="phone border-b border-gray-50 pb-2">
        {{ client.acf["e-mail"] }}
      </div>
      <div class="website border-b border-gray-50 pb-2">
        {{ client.acf.website }}
      </div>
      <div class="email">{{ client.acf.address }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  client: any;
}>();
</script>
