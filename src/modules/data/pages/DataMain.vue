<template>
  <div class="clients">
    {{ isLoading }}
    <div class="filter">
      <Selects
        v-model="selectedCategory"
        :options="categories"
        placeholder="Выберите категорию"
        @update:modelValue="filterByCategory"
      />
      <Selects
        v-model="selectedStatus"
        :options="statuses"
        placeholder="Выберите статус"
        @update:modelValue="filterByStatus"
      />
      <InputsSearch v-model="searchQuery" placeholder="Поиск клиентов..." />
    </div>
    <div class="clients_main">
      <Loader v-if="isLoading" style="background-color: transparent" />
      <div v-else>
        <div v-if="filteredClients.length > 0" class="clients__list">
          <ClientCard
            v-for="item in filteredClients"
            :key="item.id"
            :class="getStatusClass(item.acf.status)"
            :card="item"
            @deleteCard="deleteClient(item.id)"
            @updateCard="updateClient"
          />
          <pagination
            @nextPage="nextPage"
            @prevPage="prevPage"
            :totalPages="totalPages"
            :currentPage="page"
          />
        </div>
        <div v-else>
          <p>Нет результатов по вашему запросу</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "@/api/api";
import custom from "@/api/custom";
import ClientCard from "@/components/ui/card/ClientCard.vue";
import pagination from "@/components/ui/buttons/pagination.vue";
import Loader from "@/components/ui/loading/Loader.vue";
import Selects from "@/components/ui/dropdown/Selects.vue";
import InputsSearch from "@/components/ui/inputs/InputsSearch.vue";

const clients = ref<any>([]);
const categories = ref<any[]>([]);
const statuses = ref<any[]>([
  { name: "Новый", id: "Новый" },
  { name: "В обработке", id: "В обработке" },
  { name: "В работе", id: "В работе" },
  { name: "Клиент", id: "Клиент" },
  { name: "Не актуально", id: "Не актуально" },
]);
const page = ref(1);
const perPage = 10;
const totalPages = ref(1);
const selectedCategory = ref<any>("");
const selectedStatus = ref<any>("");
const searchQuery = ref<string>("");
const isLoading = ref(false);

const route = useRoute();
const router = useRouter();

const filteredClients = computed(() => {
  let filtered = clients.value;

  if (selectedCategory.value) {
    filtered = filtered.filter((client: any) =>
      client.acf.category.toLowerCase().includes(selectedCategory.value.toLowerCase())
    );
  }

  if (selectedStatus.value) {
    filtered = filtered.filter((client: any) =>
      client.acf.status.toLowerCase().includes(selectedStatus.value.toLowerCase())
    );
  }

  if (searchQuery.value) {
    const searchLower = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (client: any) =>
        client.acf.name.toLowerCase().includes(searchLower) ||
        client.acf.city.toLowerCase().includes(searchLower) ||
        client.acf.phones.some((phone: string) =>
          phone.toLowerCase().includes(searchLower)
        ) ||
        client.acf.websites.some((website: string) =>
          website.toLowerCase().includes(searchLower)
        ) ||
        client.acf.category.toLowerCase().includes(searchLower) ||
        client.acf.status.toLowerCase().includes(searchLower) ||
        client.acf.callback.toLowerCase().includes(searchLower) ||
        client.acf.comment.toLowerCase().includes(searchLower)
    );
  }

  return filtered;
});

async function getClients() {
  isLoading.value = true;
  try {
    const params: any = {
      page: page.value,
      per_page: perPage,
    };

    if (selectedCategory.value) {
      params.theme_bussines = selectedCategory.value;
    }

    if (selectedStatus.value) {
      params.status = selectedStatus.value;
    }

    if (searchQuery.value) {
      params.search = searchQuery.value;
    }

    const response = await api.get("/client_new", { params });
    clients.value = response.data;
    totalPages.value = Math.ceil(response.headers["x-wp-total"] / perPage);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
}

async function getCategories() {
  try {
    const response = await api.get("/theme_bussines");
    categories.value = response.data;
  } catch (error) {
    console.error("Failed to get categories:", error);
  }
}

async function updateClient(updatedClient: any) {
  try {
    const response = await custom.post(`/update-client/${updatedClient.id}`, {
      name: updatedClient.acf.name,
      city: updatedClient.acf.city,
      phones: updatedClient.acf.phones,
      websites: updatedClient.acf.websites,
      category: updatedClient.acf.category,
      status: updatedClient.acf.status,
      callback: updatedClient.acf.callback,
      comment: updatedClient.acf.comment,
    });
    console.log(`Client ${updatedClient.id} updated`, response.data);

    const index = clients.value.findIndex((item: any) => item.id === updatedClient.id);
    if (index !== -1) {
      clients.value[index] = updatedClient;
    }
  } catch (error) {
    console.error(`Failed to update client ${updatedClient.id}:`, error);
  }
}

async function deleteClient(clientId: number) {
  try {
    await custom.delete(`/delete-client/${clientId}`);
    clients.value = clients.value.filter((client: any) => client.id !== clientId);
  } catch (error) {
    console.error(`Failed to delete client ${clientId}:`, error);
  }
}

function getStatusClass(status: any) {
  switch (status) {
    case "Новый":
      return "status-new";
    case "В обработке":
      return "status-processing";
    case "В работе":
      return "status-working";
    case "Согласование":
      return "status-agreement";
    case "Выслан договор":
      return "status-contract-sent";
    case "Выслано предложение":
      return "status-proposal-sent";
    case "Клиент":
      return "status-client";
    case "Не актуально":
      return "status-not-relevant";
    default:
      return "";
  }
}

function filterByCategory() {
  page.value = 1; // Сбрасываем страницу при изменении категории
  getClients();
}

function filterByStatus() {
  page.value = 1; // Сбрасываем страницу при изменении статуса
  getClients();
}

function updatePage(newPage: number) {
  router.push({ query: { ...route.query, page: newPage.toString() } });
}

function nextPage() {
  if (page.value < totalPages.value) {
    updatePage(page.value + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function prevPage() {
  if (page.value > 1) {
    updatePage(page.value - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

watch(route, () => {
  if (route.query.page) {
    page.value = parseInt(route.query.page as string) || 1;

    getClients();
  }
});

watch([selectedCategory, selectedStatus, searchQuery], () => {
  filterByCategory();
});

onMounted(() => {
  page.value = parseInt(route.query.page as string) || 1;
  getClients();
  getCategories();
});
</script>

<style scoped lang="scss">
.clients {
  min-height: 100vh;
  position: relative;
}

.filter {
  margin-bottom: 20px;
  @include flex-start;
  gap: 10px;
}

.center_pag {
  min-width: 200px;
  @include flex-center;
  font-size: 18px;
}
</style>
