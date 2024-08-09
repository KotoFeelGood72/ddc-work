<template>
  <div class="clients">
    <div class="filter">
      <div class="filter_row">
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
        <Selects
          v-model="selectedCity"
          :options="cities"
          placeholder="Выберите город"
          @update:modelValue="filterByCity"
        />
        <Selects
          v-model="hasWebsite"
          :options="websiteOptions"
          placeholder="Наличие сайта"
          @update:modelValue="filterByWebsite"
        />

        <Selects
          v-model="perPage"
          :options="perPageOptions"
          placeholder="Элементов на странице"
          @update:modelValue="updatePerPage"
        />
      </div>
      <div class="change__card">
        <div
          class="row-template"
          @click="changeToRowTemplate"
          :class="{ active: route.query.view === 'list' }"
        >
          <Icons icon="mingcute:rows-3-fill" size="20" />
        </div>
        <div
          class="card-template"
          @click="changeToCardTemplate"
          :class="{ active: route.query.view === 'card' }"
        >
          <Icons icon="mingcute:rows-3-fill" size="20" />
        </div>
      </div>
    </div>
    <div class="clients_main">
      <Loader v-if="isLoading" style="background-color: transparent" />
      <div v-else>
        <div class="client_list__w" v-if="filteredClients.length > 0">
          <div
            :class="[
              {
                list: route.query.view === 'list',
                cards: route.query.view === 'card',
              },
              'clients__list',
            ]"
          >
            <component
              v-for="item in filteredClients"
              :key="item.id"
              :is="currentView"
              :class="getStatusClass(item.acf.status)"
              :card="item"
              @deleteCard="deleteClient(item.id)"
              @updateCard="updateClient"
            />
          </div>
          <pagination
            @nextPage="nextPage"
            @prevPage="prevPage"
            :totalPages="totalPages"
            :currentPage="page"
            @goToPage="goToPage"
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
import { onMounted, ref, watch, computed, markRaw } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "@/api/api";
import custom from "@/api/custom";
import ClientCard from "@/components/ui/card/ClientCard.vue";
import ClientCardDefault from "@/components/ui/card/ClientCardDefault.vue";
import pagination from "@/components/ui/buttons/pagination.vue";
import Loader from "@/components/ui/loading/Loader.vue";
import Selects from "@/components/ui/dropdown/Selects.vue";

const hasWebsite = ref("");
const websiteOptions = ref<any[]>([
  { name: "Есть сайт", id: "1" },
  { name: "Нет сайта", id: "0" },
]);

function filterByWebsite() {
  page.value = 1;
  updateQueryParamsWithPageLast();
  getClients();
}

const clients = ref<any>([]);
const categories = ref<any[]>([]);
const statuses = ref<any[]>([
  { name: "Новый", id: "Новый" },
  { name: "Не актуально", id: "Не актуально" },
  { name: "В обработке", id: "В обработке" },
  { name: "Клиент", id: "Клиент" },
]);
const cities = ref<any[]>([
  { name: "Тверь", id: "Тверь" },
  { name: "Краснодар", id: "Краснодар" },
  { name: "Москва", id: "Москва" },
  { name: "Ростов на Дону", id: "Ростов на Дону" },
  { name: "Пермь", id: "Пермь" },
]);
const perPageOptions = ref<any[]>([
  { name: "10", id: "10" },
  { name: "20", id: "20" },
  { name: "30", id: "30" },
  { name: "40", id: "40" },
  { name: "50", id: "50" },
  { name: "100", id: "100" },
]);
const page = ref(1);
const perPage = ref<any>("10");
const totalPages = ref(1);
const selectedCategory = ref<any>("");
const selectedStatus = ref<any>("");
const selectedCity = ref<any>("");
const isLoading = ref(false);
const currentView = ref(markRaw(ClientCard));

const route = useRoute();
const router = useRouter();

const filteredClients = computed(() => {
  let filtered = clients.value;

  if (selectedStatus.value !== "") {
    filtered = filtered.filter((client: any) =>
      client.acf.status.toLowerCase().includes(selectedStatus.value.toLowerCase())
    );
  }

  if (selectedCity.value !== "") {
    filtered = filtered.filter((client: any) =>
      client.acf.city.toLowerCase().includes(selectedCity.value.toLowerCase())
    );
  }

  return filtered;
});

async function getClients() {
  isLoading.value = true;
  try {
    const params: any = {
      page: page.value,
      per_page: perPage.value,
    };

    if (selectedCategory.value) {
      params.theme_bussines = selectedCategory.value;
    }

    if (selectedStatus.value !== "") {
      params.statuses = selectedStatus.value;
    }

    if (selectedCity.value !== "") {
      params.city = selectedCity.value;
    }

    if (hasWebsite.value !== "") {
      params.has_website = hasWebsite.value;
    }

    const response = await api.get("/client_new", { params });
    clients.value = response.data;
    totalPages.value = Math.ceil(response.headers["x-wp-total"] / perPage.value);
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
}

async function getCategories() {
  try {
    const response = await api.get("/theme_bussines/?per_page=100");
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
    case "Клиент":
      return "status-client";
    case "Не актуально":
      return "status-not-relevant";
    default:
      return "";
  }
}

function filterByCategory() {
  page.value = 1;
  updateQueryParamsWithPageLast();
  getClients();
}

function filterByStatus() {
  page.value = 1;
  updateQueryParamsWithPageLast();
  getClients();
}

function filterByCity() {
  page.value = 1;
  updateQueryParamsWithPageLast();
  getClients();
}

function updatePerPage() {
  page.value = 1;
  updateQueryParamsWithPageLast();
  getClients();
}

function updateQueryParamsWithPageLast() {
  const query: any = { ...route.query };

  if (selectedCategory.value) {
    query.category = selectedCategory.value;
  } else {
    delete query.category;
  }

  if (selectedStatus.value !== "") {
    query.status = selectedStatus.value;
  } else {
    delete query.status;
  }

  if (selectedCity.value !== "") {
    query.city = selectedCity.value;
  } else {
    delete query.city;
  }

  if (hasWebsite.value !== "") {
    query.has_website = hasWebsite.value;
  } else {
    delete query.has_website;
  }

  query.page = page.value.toString();
  query.count = perPage.value.toString();
  query.view = currentView.value === ClientCardDefault ? "card" : "list";

  router.replace({ query });
}

function updatePage(newPage: number) {
  page.value = newPage;
  updateQueryParamsWithPageLast();
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

const goToPage = (newPage: number) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    updatePage(newPage);
  }
};

const changeToRowTemplate = () => {
  currentView.value = markRaw(ClientCard);
  updateQueryParamsWithPageLast(); // обновляем query параметры после смены шаблона
};

const changeToCardTemplate = () => {
  currentView.value = markRaw(ClientCardDefault);
  updateQueryParamsWithPageLast();
};

watch(
  () => route.query,
  (newQuery, oldQuery) => {
    const queryChanged = (param: string) => newQuery[param] !== oldQuery[param];

    // Проверяем изменение значимых параметров
    const significantParams = ["page", "perPage", "category", "status", "city", "view"];
    const isSignificantChange = significantParams.some((param) => queryChanged(param));

    if (isSignificantChange) {
      if (queryChanged("page")) {
        page.value = parseInt(route.query.page as string) || 1;
      }

      if (queryChanged("perPage")) {
        perPage.value = parseInt(route.query.perPage as string) || 20;
      }

      if (queryChanged("category")) {
        selectedCategory.value = route.query.category || "";
      }

      if (queryChanged("status")) {
        selectedStatus.value = route.query.status || "";
      }

      if (queryChanged("city")) {
        selectedCity.value = route.query.city || "";
      }

      if (queryChanged("view")) {
        currentView.value =
          route.query.view === "card" ? markRaw(ClientCardDefault) : markRaw(ClientCard);
      }

      getClients();
    }
  }
);

watch([selectedCategory, selectedStatus, selectedCity, hasWebsite], () => {
  filterByCategory();
});

onMounted(() => {
  page.value = parseInt(route.query.page as string) || 1;
  perPage.value = parseInt(route.query.perPage as string) || 20;
  selectedCategory.value = route.query.category || "";
  selectedStatus.value = route.query.status || "";
  selectedCity.value = route.query.city || "";
  currentView.value =
    (route.query.view as string) === "card"
      ? markRaw(ClientCardDefault)
      : markRaw(ClientCard);
  getClients();
  getCategories();
});
</script>

<style scoped lang="scss">
.clients {
  min-height: 100vh;
  position: relative;
  width: 100%;
}

.filter {
  margin-bottom: 20px;
  @include flex-start;
  gap: 20px;
}

.filter_row {
  flex-grow: 1;
  @include flex-start;
  gap: 10px;

  @include bp($point_4) {
    flex-direction: column;
    width: 100%;
  }
}

.change__card {
  @include flex-start;
  gap: 5px;

  @include bp($point_4) {
    display: none;
  }

  div {
    @include flex-center;
    background-color: $bg-color-secondary;
    width: 42px;
    height: 42px;
    border-radius: 5px;
    color: $secondary-blue-active;
    cursor: pointer;
    svg {
      color: $secondary-blue-active !important;
    }

    &.active {
      background-color: $secondary-blue;
      svg {
        color: $primary-blue-active !important;
      }
    }

    &:nth-child(2) {
      transform: rotate(90deg);
    }
  }
}

.center_pag {
  min-width: 200px;
  @include flex-center;
  font-size: 18px;
}

.clients__list {
  overflow-x: auto;
  max-width: 100%;
  margin-bottom: 30px;

  &.cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(30%, 1fr));
    grid-gap: 20px;

    @include bp($point_4) {
      grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
    }
  }
}

.clients_main {
  width: 100%;
}

.filter {
  @include bp($point_4) {
    flex-direction: column;
  }
}
</style>
