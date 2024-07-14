<template>
  <div class="card">
    <div class="card_col__left">
      <avatar />
      <div class="card__title">
        <p>{{ card.acf.name }}</p>
      </div>
      <div class="card__address" @click="copyToClipboard(card.acf.address)">
        <span>{{ card.acf.address }}</span>
        <div class="clipboard">
          <Icons icon="solar:clipboard-linear" size="18px" color="#424242" />
        </div>
      </div>
      <div
        class="card__phone"
        v-if="formattedPhone"
        @click="[openQR(formattedPhone, 'phone')]"
      >
        <span>{{ formattedPhone }}</span>
        <div class="clipboard" @click="copyToClipboard(formattedPhone)">
          <Icons icon="solar:clipboard-linear" size="18px" color="#424242" />
        </div>
      </div>
      <div class="card__website" v-if="firstWebsite">
        <a :href="firstWebsite" target="_blank">{{ firstWebsite }}</a>
        <div class="clipboard" @click="copyToClipboard(firstWebsite)">
          <Icons icon="solar:clipboard-linear" size="18px" color="#424242" />
        </div>
      </div>
      <div class="card__categories">{{ card.category_name }}</div>
    </div>
    <div class="card_col__right">
      <div class="card__status">
        <div v-tooltip="'В обработке'">
          <div class="status_processing" @click="updateStatus('В обработке')"></div>
        </div>
        <div v-tooltip="'В работе'">
          <div class="status_working" @click="updateStatus('В работе')"></div>
        </div>
        <div v-tooltip="'Клиент'">
          <div class="status_client" @click="updateStatus('Клиент')"></div>
        </div>
        <div v-tooltip="'Не актуально'">
          <div class="status_not-relevant" @click="updateStatus('Не актуально')"></div>
        </div>
      </div>
      <div class="card__btn">
        <div class="card__open" @click="openClient(card.id)" v-tooltip="'Открыть'">
          <Icons icon="ion:open-outline" size="22px" color="green" />
        </div>
        <div class="card__delete" @click="emit('deleteCard')" v-tooltip="'Удалить'">
          <Icons icon="weui:delete-outlined" size="22px" color="white" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import avatar from "../people/avatar.vue";
import { useModalStore } from "@/store/useModalStore";
import { useRouter } from "vue-router";

const props = withDefaults(
  defineProps<{
    card: any;
  }>(),
  {
    card: {},
  }
);

const { openModal } = useModalStore();
const router = useRouter();

const emit = defineEmits(["deleteCard", "updateCard"]);

const firstWebsite = computed(() => {
  if (!props.card.acf.websites) return null;
  const websitesArray = props.card.acf.websites
    .split(/[\s|,]+/)
    .map((item: any) => item.trim())
    .filter(isValidUrl);
  return websitesArray[0] || null;
});

const formattedPhone = computed(() => {
  if (!props.card.acf.phones) return null;
  const phones = props.card.acf.phones.split(" ").map((phone: any) => phone.trim());
  const firstPhone = phones[0];
  if (firstPhone.startsWith("8")) {
    return formatPhoneNumber(firstPhone.replace("8", "+7"));
  } else {
    return formatPhoneNumber(firstPhone);
  }
});

function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

function formatPhoneNumber(phone: string): string {
  const cleaned = ("" + phone).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/);
  if (match) {
    return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}-${match[5]}`;
  }
  return phone;
}

function updateStatus(newStatus: string) {
  emit("updateCard", { ...props.card, acf: { ...props.card.acf, status: newStatus } });
}

function copyToClipboard(text: string) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      console.log(`Copied to clipboard: ${text}`);
    })
    .catch((err) => {
      console.error("Failed to copy text: ", err);
    });
}

function openClient(id: number) {
  openModal("client");
  router.push({ query: { client: id } });
}

function openQR(link: any, type: "phone" | "url") {
  openModal("qr");
  if (type === "phone") {
    router.push({ query: { phone: link } });
  }
}
</script>

<style scoped lang="scss">
.card,
.card_col__left,
.card_col__right,
.card__btn {
  @include flex-start;
}

.card_col__left {
  gap: 10px;
  flex-grow: 1;
}
.card_col__right {
  gap: 30px;
}
.card__btn {
  gap: 5px;
}

.card {
  justify-content: space-between;
  background-color: $bg-color-quaternary;
  border-radius: 10px;
  margin: 20px 0;
  padding: 15px 20px;
}

.card__status {
  @include flex-end;
  gap: 7px;
  div {
    width: 50px;
    height: 15px;
    border-radius: 3px;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    box-shadow: 0px 2px 10px 0px #00000017;
    // border: 1px solid #7474743f;

    &.status_processing {
      background-color: $secondary-orange-active;
      &:hover {
        background-color: $primary-orange;
      }
    }
    &.status_working {
      background-color: $secondary-green-active;
      &:hover {
        background-color: $primary-green;
      }
    }
    &.status_client {
      background-color: $secondary-blue-active;
      &:hover {
        background-color: $primary-blue;
      }
    }
    &.status_not-relevant {
      background-color: $secondary-red-active;
      &:hover {
        background-color: $primary-red;
      }
    }
  }
}

.card__open {
  background-color: $secondary-green;
  @include flex-center;
  padding: 7px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    background-color: $secondary-green-active;
  }
}
.card__delete {
  background-color: $primary-red;
  @include flex-center;
  padding: 7px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    background-color: $primary-red-hover;
  }
}

.card__phone,
.card__website,
.card__categories,
.card__title,
.card__address {
  gap: 10px;
  width: 17%;
  padding: 7px 20px;
  font-size: $small-3;
  cursor: pointer;
  position: relative;
  z-index: 2;
  @include flex-center;
  &:hover {
    &:before {
      background-color: #94939348;
    }
  }
  &:before {
    border-radius: 5px;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #9493931a;
    content: "";
    z-index: -1;
    backdrop-filter: blur(20px);
    transition: all 0.3s ease-in-out;
  }
}

.clipboard {
  @include flex-center;
}

.status-new {
  background-color: $bg-color-secondary;
}

.status-processing {
  // background-color: $secondary-orange;
  .card__status {
    .status_processing {
      background-color: $primary-orange;
    }
  }
}
.status-working {
  // background-color: $secondary-green;
  .card__status {
    .status_working {
      background-color: $primary-green;
    }
  }
}

.status-client {
  // background-color: $secondary-blue;
  .card__status {
    .status_client {
      background-color: $primary-blue;
    }
  }
}
.status-not-relevant {
  // background-color: $secondary-red;
  .card__status {
    .status_not-relevant {
      background-color: $primary-red;
    }
  }
}

.card__title {
  p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.card__address {
  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
