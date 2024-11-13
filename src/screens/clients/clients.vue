<template>
  <div class="clients">
    <div class="clients_head"></div>
    <div class="clients_body">
      <Client v-for="(item, i) in clients" :key="'item-clients-' + i" :client="item" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Client from "@/components/ui/card/Client.vue";
import { useClientsStore, useClientsStoreRefs } from "@/stores/useClientsStore";
import { onMounted } from "vue";

const { fetchClients } = useClientsStore();
const { clients } = useClientsStoreRefs();

onMounted(() => {
  fetchClients();
});
</script>

<style scoped></style>
