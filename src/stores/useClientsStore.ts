import { defineStore, storeToRefs } from "pinia";
import {api} from "@/api/api";

export const useClientsStore = defineStore("clients", {
  state: () => ({
    clients: [] as any[],
  }),
  actions: {
    async fetchClients() {
      try {
        const response = await api.get('/wp-content/uploads/json/clients/all-clients.json')
        this.clients = response.data
      } catch (error) {
        
      }
    }
  },
});

export const useClientsStoreRefs = () => storeToRefs(useClientsStore());
