<template>
  <div class="clients">
    <AuthLogin />
    <v-table>
      <thead>
        <tr>
          <th class="text-left">Наименование</th>
          <th class="text-left">Город</th>
          <th class="text-left">Телефон</th>
          <th class="text-left">Website</th>
          <th class="text-left">Категория</th>
          <th class="text-left">Статус</th>
          <th class="text-left">Перезвонить</th>
          <th class="text-left">Комментарий</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in clients"
          :key="item.id"
          :class="getStatusClass(item.acf.status)"
        >
          <td><input v-model="item.acf.name" @change="updateClient(item)" /></td>
          <td><input v-model="item.acf.city" @change="updateClient(item)" /></td>
          <td><input v-model="item.acf.phones" @change="updateClient(item)" /></td>
          <td>
            <div>
              <span
                v-for="(website, index) in splitWebsites(item.acf.websites)"
                :key="index"
              >
                <template v-if="isValidUrl(website)">
                  <a :href="website.trim()" target="_blank">{{ website.trim() }}</a>
                </template>
                <template v-else>
                  {{ website.trim() }}
                </template>
                <span v-if="index < splitWebsites(item.acf.websites).length - 1">
                  |
                </span>
              </span>
            </div>
          </td>
          <td><input v-model="item.acf.category" @change="updateClient(item)" /></td>
          <td>
            <select v-model="item.acf.status" @change="updateClient(item)">
              <option value="Новый">Новый</option>
              <option value="В обработке">В обработке</option>
              <option value="В работе">В работе</option>
              <option value="Согласование">Согласование</option>
              <option value="Выслан договор">Выслан договор</option>
              <option value="Выслано предложение">Выслано предложение</option>
              <option value="Клиент">Клиент</option>
              <option value="Не актуально">Не актуально</option>
            </select>
          </td>
          <td><input v-model="item.acf.callback" @change="updateClient(item)" /></td>
          <td><input v-model="item.acf.comment" @change="updateClient(item)" /></td>
        </tr>
      </tbody>
    </v-table>
    <div class="pagination">
      <button @click="prevPage" :disabled="page === 1">Previous</button>
      <span>Page {{ page }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="page === totalPages">Next</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "@/api/api";
import custom from "@/api/custom";
import AuthLogin from "../../../components/modal/view/AuthLogin.vue";

const clients = ref<any>([]);
const page = ref(1);
const perPage = 10;
const totalPages = ref(1);

const route = useRoute();
const router = useRouter();

async function getClients() {
  try {
    const response = await api.get(`/client_new?page=${page.value}&per_page=${perPage}`);
    clients.value = response.data;
    totalPages.value = Math.ceil(response.headers["x-wp-total"] / perPage);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}

async function updateClient(client: any) {
  try {
    const response = await custom.post(`/update-client/${client.id}`, {
      name: client.acf.name,
      city: client.acf.city,
      phones: client.acf.phones,
      websites: client.acf.websites,
      category: client.acf.category,
      status: client.acf.status,
      callback: client.acf.callback,
      comment: client.acf.comment,
    });
    console.log(`Client ${client.id} updated`, response.data);
  } catch (error) {
    console.error(`Failed to update client ${client.id}:`, error);
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

function isValidUrl(url: string): boolean {
  return /^https?:\/\//i.test(url.trim());
}

function splitWebsites(websites: string): string[] {
  return websites.split("|").map((site) => site.trim());
}

function updatePage(newPage: number) {
  router.push({ query: { ...route.query, page: newPage.toString() } });
}

function nextPage() {
  if (page.value < totalPages.value) {
    updatePage(page.value + 1);
  }
}

function prevPage() {
  if (page.value > 1) {
    updatePage(page.value - 1);
  }
}

watch(route, () => {
  page.value = parseInt(route.query.page as string) || 1;
  getClients();
});

onMounted(() => {
  page.value = parseInt(route.query.page as string) || 1;
  getClients();
});
</script>

<style scoped lang="scss">
.clients {
  // стили для таблицы и пагинации
}
.pagination {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
.status-new {
  background-color: #e0f7fa;
}
.status-processing {
  background-color: #ffeb3b;
}
.status-working {
  background-color: #ff9800;
}
.status-agreement {
  background-color: #4caf50;
}
.status-contract-sent {
  background-color: #2196f3;
}
.status-proposal-sent {
  background-color: #673ab7;
}
.status-client {
  background-color: #9e9e9e;
}
.status-not-relevant {
  background-color: #f44336;
}
</style>
