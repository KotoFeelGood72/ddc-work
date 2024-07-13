<template>
  <div class="single">
    <div class="single__main" v-if="clientData && clientData.acf">
      <div class="single_status">
        <div
          v-for="status in statuses"
          :key="status"
          class="single_status__item"
          :class="[
            getStatusClass(status, clientData.acf.status),
            getStatusColorClass(status),
          ]"
          @click="updateClientStatus(status)"
        >
          {{ status }}
        </div>
      </div>
      <div class="single__head">
        <div class="single__title">{{ clientData.acf.name }}</div>
        <div class="single__desc">{{ clientData.acf.address }}</div>
      </div>
      <div class="single_body">
        <div class="single_body__row">
          <div class="single_body__item">
            Категория: <span>{{ clientData.category_name }}</span>
          </div>
          <div class="single_body__item">
            Телефон: <span>{{ clientData.acf.phones }}</span>
          </div>
        </div>
        <div class="single_body__row">
          <div class="single_body__item">
            Вебсайт: <span>{{ clientData.acf.websites }}</span>
          </div>
          <div class="single_body__item">
            Город: <span>{{ clientData.acf.city }}</span>
          </div>
          <div class="single_body__item">
            Перезвонить: <span>{{ clientData.acf.callback }}</span>
          </div>
        </div>
        <div class="single_body__row commentary">
          <div class="commentary__label">Комментарий</div>
          <InputArea v-model="clientData.acf.comment" />
        </div>
        <div class="single__action">
          <defaultBtn name="Сохранить" @click="saveCommentary" />
        </div>
      </div>
    </div>
    <Loader v-else />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import InputArea from "@/components/ui/inputs/InputArea.vue";
import defaultBtn from "@/components/ui/buttons/default-btn.vue";
import Loader from "@/components/ui/loading/Loader.vue";
import api from "@/api/api";
import custom from "@/api/custom"; // Импортируем ваш кастомный API для обновления клиента

const route = useRoute();
const clientData = ref<any>({});
const commentary = ref<string>("");
const statuses = ["Новый", "В обработке", "В работе", "Клиент", "Не актуально"];

async function getClientById(id: string) {
  try {
    const response = await api.get(`/client_new/${id}`);
    clientData.value = response.data;
  } catch (error) {
    console.error("Failed to fetch client data:", error);
  }
}

function getStatusClass(status: string, activeStatus: string) {
  return status === activeStatus ? "status-active" : "status-inactive";
}

function getStatusColorClass(status: string) {
  switch (status) {
    case "Новый":
      return "status-new";
    case "В обработке":
      return "status-processing";
    case "В работе":
      return "status-working";
    case "Клиент":
      return "status-client";
    case "Не актуально":
      return "status-not-relevant";
    default:
      return "";
  }
}

onMounted(() => {
  if (route.query.client) {
    getClientById(route.query.client as string);
  }
});

watch(
  () => route.query.client,
  (newClientId) => {
    if (newClientId) {
      console.log("Client ID from query:", newClientId);
      getClientById(newClientId as string);
    }
  }
);

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

    // Обновляем локальные данные клиента
    clientData.value = updatedClient;
  } catch (error) {
    console.error(`Failed to update client ${updatedClient.id}:`, error);
  }
}

function saveCommentary() {
  if (clientData.value && clientData.value.acf) {
    clientData.value.acf.comment = commentary.value;
    updateClient(clientData.value);
    console.log("Commentary saved:", commentary.value);
  }
}

function updateClientStatus(status: string) {
  if (clientData.value && clientData.value.acf) {
    clientData.value.acf.status = status;
    updateClient(clientData.value);
  }
}
</script>

<style scoped lang="scss">
.single {
  background-color: #ffffff;
  height: 100vh;
  padding: 40px;
  min-width: 600px;
  max-width: 600px;
  margin-left: auto;
  margin-right: 0;
  position: relative;
  font-size: $small-2;
}

.single__head {
  margin-bottom: 20px;
  .single__title {
    font-size: 24px;
    max-width: 450px;
    margin-bottom: 5px;
    line-height: 28px;
  }
}

.single_body__row,
.single_body {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.single_body {
  gap: 20px;
}
.single_body__item {
  @include flex-space;
  background-color: #8d8d8d1e;
  padding: 10px 20px;
  border-radius: 8px;
  gap: 20px;
}

.single__action {
  @include flex-start;
  gap: 10px;
}

.single_status {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(18%, 1fr));
  gap: 3px;
  width: 100%;
  margin-bottom: 20px;

  .single_status__item {
    padding: 10px;
    border-radius: 8px;
    text-align: center;
    cursor: pointer;
    font-size: $small-3;
    &:hover {
      opacity: 0.8;
    }
  }

  .status-new {
    background-color: $bg-color-primary;
    color: white;
  }

  .status-processing {
    background-color: $secondary-orange;
    color: white;
  }

  .status-working {
    background-color: $secondary-green;
    color: white;
  }

  .status-client {
    background-color: $secondary-blue;
    color: white;
  }

  .status-not-relevant {
    background-color: $secondary-red;
    color: white;
  }

  .status-active {
    &.status-new {
      background-color: $text-color-primary;
      color: white;
    }

    &.status-processing {
      background-color: $primary-orange;
      color: white;
    }

    &.status-working {
      background-color: $primary-green;
      color: white;
    }

    &.status-client {
      background-color: $primary-blue;
      color: white;
    }

    &.status-not-relevant {
      background-color: $primary-red;
      color: white;
    }
  }

  .status-inactive {
    opacity: 0.6;
  }
}
</style>
