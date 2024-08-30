import { defineStore, storeToRefs } from 'pinia';
import api from '@/api/api';
import custom from '@/api/custom';

export const useClientStore = defineStore('clientStore', {
  state: () => ({
    clients: [] as any[],
    categories: [] as any[],
    statuses: [
      { name: 'Новый', id: '' },
      { name: 'Не актуально', id: 'Не актуально' },
      { name: 'В обработке', id: 'В обработке' },
      { name: 'В работе', id: 'В работе' },
      { name: 'Клиент', id: 'Клиент' }
    ],
    cities: [
      { name: 'Тверь', id: 'Тверь' },
      { name: 'Краснодар', id: 'Краснодар' },
      { name: 'Москва', id: 'Москва' },
      { name: 'Ростов на Дону', id: 'Ростов на Дону' },
      { name: 'Пермь', id: 'Пермь' }
    ],
    perPageOptions: [
      { name: '10', id: '10' },
      { name: '20', id: '20' },
      { name: '30', id: '30' },
      { name: '40', id: '40' },
      { name: '50', id: '50' },
      { name: '100', id: '100' }
    ],
    hasWebsiteOptions: [
      { name: 'Есть сайт', id: '1' },
      { name: 'Нет сайта', id: '0' }
    ],
    page: 1,
    perPage: '10' as any,
    totalPages: 1 as any,
    selectedCategory: '',
    selectedStatus: '',
    selectedCity: '',
    hasWebsite: '',
    searchQuery: '',
    searchPhone: '',
    isLoading: false,
    currentView: 'list', // 'list' or 'card'
  }),
  actions: {
    async getClients() {
      this.isLoading = true;
      try {
        const params: any = {
          page: this.page,
          per_page: this.perPage,
        };

        if (this.selectedCategory) {
          params.theme_bussines = this.selectedCategory;
        }

        if (this.selectedStatus) {
          params.statuses = this.selectedStatus;
        }

        if (this.selectedCity) {
          params.city = this.selectedCity;
        }

        if (this.hasWebsite) {
          params.has_website = this.hasWebsite;
        }

        if (this.searchQuery) {
          params.search = this.searchQuery;
        }

        if (this.searchPhone) {
          params.phone = this.searchPhone;
        }

        const response = await api.get('/client_new', { params });
        this.clients = response.data;
        this.totalPages = Math.ceil(response.headers['x-wp-total'] / this.perPage);
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },

    getStatusClass(status: string) {
        switch (status) {
          case 'Новый':
            return 'status-new';
          case 'В обработке':
            return 'status-processing';
          case 'В работе':
            return 'status-working';
          case 'Клиент':
            return 'status-client';
          case 'Не актуально':
            return 'status-not-relevant';
          default:
            return '';
        }
      },

    async getCategories() {
      try {
        const response = await api.get('/theme_bussines/?per_page=100');
        this.categories = response.data;
      } catch (error) {
        console.error('Failed to get categories:', error);
      }
    },

    async updateClient(updatedClient: any) {
      try {
        await custom.post(`/update-client/${updatedClient.id}`, {
          name: updatedClient.acf.name,
          city: updatedClient.acf.city,
          phones: updatedClient.acf.phones,
          websites: updatedClient.acf.websites,
          category: updatedClient.acf.category,
          status: updatedClient.acf.status,
          callback: updatedClient.acf.callback,
          comment: updatedClient.acf.comment,
        });

        const index = this.clients.findIndex((item) => item.id === updatedClient.id);
        if (index !== -1) {
          this.clients[index] = updatedClient;
        }
      } catch (error) {
        console.error(`Failed to update client ${updatedClient.id}:`, error);
      }
    },

    async deleteClient(clientId: number) {
      try {
        await custom.delete(`/delete-client/${clientId}`);
        this.clients = this.clients.filter((client) => client.id !== clientId);
      } catch (error) {
        console.error(`Failed to delete client ${clientId}:`, error);
      }
    },

    setCurrentView(view: string) {
      this.currentView = view;
    },

    // Эти методы будут вызываться при изменении фильтров
    updateCategory(category: string) {
      this.selectedCategory = category;
      this.page = 1;
      this.getClients();
    },

    updateStatus(status: string) {
      this.selectedStatus = status;
      this.page = 1;
      this.getClients();
    },

    updateCity(city: string) {
      this.selectedCity = city;
      this.page = 1;
      this.getClients();
    },

    updateHasWebsite(hasWebsite: string) {
      this.hasWebsite = hasWebsite;
      this.page = 1;
      this.getClients();
    },

    updateSearchQuery(query: string) {
      this.searchQuery = query;
      this.page = 1;
      this.getClients();
    },

    updateSearchPhone(phone: string) {
      this.searchPhone = phone;
      this.page = 1;
      this.getClients();
    },

    updatePerPage(perPage: any) {
      this.perPage = perPage;
      this.page = 1;
      this.getClients();
    },

    updatePage(newPage: number) {
      this.page = newPage;
      this.getClients();
    },

    clearFilters() {
      this.selectedCategory = '';
      this.selectedStatus = '';
      this.selectedCity = '';
      this.hasWebsite = '';
      this.page = 1;
      this.perPage = '10';
      this.searchQuery = '';
      this.searchPhone = '';
      this.getClients();
    },
    updateClientInStore(updatedClient: any) {
      const index = this.clients.findIndex(client => client.id === updatedClient.id);
      if (index !== -1) {
        this.clients[index] = { ...this.clients[index], ...updatedClient };
      }
    },
    async updateClientStatus(clientId: number, newStatus: string) {
        try {
          // Находим клиента в хранилище
          const clientIndex = this.clients.findIndex(client => client.id === clientId);
          if (clientIndex === -1) return;
  
          // Обновляем статус клиента на сервере
          const updatedClient = { ...this.clients[clientIndex], acf: { ...this.clients[clientIndex].acf, status: newStatus }};
          await custom.post(`/update-client/${clientId}`, {
            status: newStatus,
          });
  
          // Обновляем клиента в хранилище
          this.clients[clientIndex] = updatedClient;
        } catch (error) {
          console.error(`Failed to update status for client ${clientId}:`, error);
        }
      },
  },
});



export const useClientStoreRefs = () => storeToRefs(useClientStore());
