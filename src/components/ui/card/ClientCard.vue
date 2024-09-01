<!-- @format -->

<template>
  <transition name="fade" @after-leave="handleAfterLeave">
    <div v-if="!isDeleted" class="card" @click="openClient(card.id)">
      <button @click.stop="sendKP">Отправить КП</button>
      <div class="card_top">
        <ul class="card_tab__link">
          <li @click.stop="activeTab = 'org'" :class="{ active: activeTab === 'org' }">
            Сведение об организации
          </li>
          <li @click.stop="activeTab = 'info'" :class="{ active: activeTab === 'info' }">
            Сведение о контактном лице
          </li>
          <li
            @click.stop="activeTab = 'history'"
            :class="{ active: activeTab === 'history' }"
          >
            Взаимодействие
          </li>
        </ul>
        <Selects
          v-model="selectedStatus"
          :options="statuses"
          placeholder="Выберите статус"
          class="select_status"
          @update:modelValue="updateStatus(selectedStatus)"
        />
      </div>
      <ul class="card_tab__contents">
        <li class="card_tab__content" v-if="activeTab === 'org'">
          <ul class="info__list">
            <li>
              <Icons icon="solar:case-broken" :size="18" />
              <p>Организация:</p>
              <span>{{ card.acf.name }}</span>
            </li>
            <li>
              <Icons icon="solar:city-broken" :size="18" />
              <p>Отрасль:</p>
              <span>{{ card.acf.name }}</span>
            </li>
            <li>
              <Icons icon="solar:map-arrow-square-broken" :size="18" />
              <p>Адрес организации:</p>
              <span>{{ card.acf.address }}</span>
            </li>
            <li>
              <Icons icon="solar:phone-rounded-broken" :size="18" />
              <p>Телефон контактный:</p>
              <div
                class="card__phone"
                v-if="formattedPhone"
                @click.stop="handlePhoneClick"
              >
                <span>{{ formattedPhone }}</span>
              </div>
            </li>
            <li>
              <Icons icon="solar:code-circle-broken" :size="18" />
              <p>Сайт:</p>
              <a :href="firstWebsite" target="_blank" @click.stop="handleWebsiteClick">{{
                firstWebsite
              }}</a>
            </li>
            <li>
              <Icons icon="solar:document-add-broken" :size="18" />
              <p>E-mail:</p>
              <span>{{ card.acf.email }}</span>
            </li>
            <li>
              <Icons icon="solar:user-id-broken" :size="18" />
              <p>ФИО, должность руководителя:</p>
              <span>{{ card.acf.fio }}</span>
            </li>
          </ul>
        </li>
        <li class="card_tab__content" v-if="activeTab === 'info'">
          <ul class="info__list">
            <li>
              <Icons icon="solar:case-broken" :size="18" />
              <p>Ф.И.О:</p>
              <span>{{ card.acf.name }}</span>
            </li>
            <li>
              <Icons icon="solar:city-broken" :size="18" />
              <p>Год рождения:</p>
              <span>{{ card.acf.name }}</span>
            </li>
            <li>
              <Icons icon="solar:map-arrow-square-broken" :size="18" />
              <p>Должность:</p>
              <span>{{ card.acf.address }}</span>
            </li>
            <li>
              <Icons icon="solar:phone-rounded-broken" :size="18" />
              <p>Телефон контактный:</p>
              <div
                class="card__phone"
                v-if="formattedPhone"
                @click.stop="handlePhoneClick"
              >
                <span>{{ formattedPhone }}</span>
              </div>
            </li>
            <li>
              <Icons icon="solar:document-add-broken" :size="18" />
              <p>E-mail:</p>
              <span>{{ card.acf.email }}</span>
            </li>
            <li>
              <Icons icon="solar:code-circle-broken" :size="18" />
              <p>ЛПР:</p>
              <span class="tags">Да</span>
            </li>
            <li>
              <Icons icon="solar:code-circle-broken" :size="18" />
              <p>ЛПР Связаный с клиентом:</p>
              <span>Иванов Иван Иванович</span>
            </li>
            <li>
              <Icons icon="solar:document-add-broken" :size="18" />
              <p>E-mail:</p>
              <span>{{ card.acf.email }}</span>
            </li>
            <li class="list_item__full">
              <Icons icon="solar:user-id-broken" :size="18" />
              <p>Услуги:</p>
              <ul class="box__list">
                <li>Продвижение сайта</li>
                <li>Разработка сайта</li>
                <li>Контекстная реклама</li>
                <li>Правки на сайте</li>
              </ul>
            </li>
          </ul>
        </li>
        <li class="card_tab__content" v-if="activeTab === 'history'">
          <ul class="info__list history_list">
            <li class="history_item">
              <div class="item_head">
                <p>Перезвонить:</p>
              </div>
              <div class="input_date">
                <DatePicker
                  v-model="card.acf.callback"
                  :format="'dd.MM.yyyy HH:mm'"
                  :enable-time="true"
                  :locale="ruLocale"
                  placeholder="Ввести дату"
                />
                <Icons icon="solar:calendar-date-broken" />
              </div>
            </li>
            <li class="history_item comment">
              <div class="history_item__top">
                <Icons icon="solar:chat-round-broken" />
                Лог взаимодействия:
              </div>
              <ul class="comment_list">
                <li><p>— Вы не знаете, который сейчас час? Уже есть шесть часов?</p></li>
                <li>
                  <p>
                    — А вы что, на телефон не можете посмотреть? — раздраженно ответила
                    женщина с огромными сумками в руках.
                  </p>
                </li>
                <li><p>— У меня отключился телефон, — грустно объяснил юноша.</p></li>
                <li>
                  <p>— Половина шестого, — ответила женщина и быстро побежала прочь.</p>
                </li>
              </ul>
              <textarea
                name=""
                id=""
                placeholder="Оставить комментарий"
                v-model="newComment"
                @click.stop
              ></textarea>
              <div class="send_comment" @click.stop="addComment">
                <Icons icon="solar:chat-round-unread-bold" />Отправить
              </div>
            </li>
          </ul>
        </li>
      </ul>
      <div class="card_bottom">
        <div class="card_bottom__left">
          <div class="card_link__btn">
            <IcBtn icon="solar:login-broken" />
            Открыть
          </div>
          <div class="card_link__btn">
            <IcBtn icon="solar:star-broken" />
            Добавить в избранное
          </div>
          <div class="card_link__btn">
            <IcBtn icon="solar:trash-bin-minimalistic-2-broken" />
            Удалить
          </div>
        </div>
        <div class="card_bottom__right">
          <div class="card__view">
            <Icons icon="solar:eye-broken" :size="20" />Просмотрено: 1
          </div>
          <div class="card__kp">
            <Icons icon="solar:file-right-broken" :size="20" />КП: Отправлено
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import Selects from "../dropdown/Selects.vue";
import IcBtn from "../buttons/IcBtn.vue";
import { useModalStore } from "@/store/useModalStore";
import { useRouter } from "vue-router";
// @ts-ignore
import DatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
// import { ru } from "date-fns/locale";
import { useClientStore, useClientStoreRefs } from "@/store/useClientStore";
import axios from "axios";
const props = withDefaults(
  defineProps<{
    card: any;
  }>(),
  {
    card: {},
  }
);

const { openModal } = useModalStore();
const clientStore = useClientStore();
const { statuses } = useClientStoreRefs();
const router = useRouter();
const ruLocale = ref<string>("ru");
const activeTab = ref<any>("org");
const selectedStatus = ref<any>(props.card.acf.status);
const newComment = ref("");
const emit = defineEmits(["deleteCard", "updateCard"]);
const isLoading = ref(false);
const isDeleted = ref(false);

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
  console.log("Good", selectedStatus.value);
  clientStore.updateClientStatus(props.card.id, newStatus);
  emit("updateCard", { ...props.card, acf: { ...props.card.acf, status: newStatus } });
}

function openClient(id: number) {
  openModal("client");
  const query = { ...router.currentRoute.value.query, client: id };
  router.push({ query });
}

function addComment() {
  if (newComment.value.trim()) {
    // Подготовка данных для обновления клиента
    const updatedClient = {
      id: props.card.id,
      acf: {
        ...props.card.acf,
        clientHistory: newComment.value.trim(), // Отправляем массив объектов
      },
    };

    // Отправляем данные на сервер
    clientStore
      .updateClient(updatedClient)
      .then(() => {
        console.log("Комментарий успешно отправлен");
      })
      .catch((error) => {
        console.error("Ошибка при отправке комментария:", error);
      });

    // Очищаем поле ввода
    newComment.value = "";
  }
}

function handlePhoneClick() {
  openQR(formattedPhone.value, "phone");
  // updateStatus("В обработке");
}

function handleWebsiteClick(event: Event) {
  event.preventDefault();
  // updateStatus("В обработке");
  window.open(firstWebsite.value, "_blank");
}

function openQR(link: any, type: "phone" | "url") {
  openModal("qr");
  if (type === "phone") {
    const query = { ...router.currentRoute.value.query, phone: link };
    router.push({ query });
  }
}

async function deleteCard() {
  isLoading.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    emit("deleteCard");
    isDeleted.value = true;
  } catch (error) {
    console.error("Failed to delete card: ", error);
  } finally {
    isLoading.value = false;
  }
}

function triggerDelete() {
  isDeleted.value = true;
}

function handleAfterLeave() {
  deleteCard();
}

function sendKP() {
  const data = {
    to: "ddc-sellers@yandex.ru",
    subject: "Презентация от компании Счастье",
    name: "Александр",
    phone: "+7(123)456-78-90",
  };

  const response = axios.post(
    "https://manager.dynamic-devs-collective.ru/wp-json/custom/v1/send-email",
    data
  );
}
</script>

<style scoped lang="scss">
.card {
  background-color: $white;
  border: 1px solid $light;
  // padding: 20px;
}
.card_top {
  margin-bottom: 10px;
  @include flex-space;
  padding-right: 15px;
  border-bottom: 1px solid $light;

  &:deep(.custom-select) {
    max-width: 300px;
  }
}
.card_tab__link {
  @include flex-start;
  list-style: none;
  // gap: 10px;

  li {
    border-bottom: 2px solid transparent;
    // background-color: $ulight;
    height: 100%;
    padding: 15px 15px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    &:hover {
      color: $blue;
    }

    &.active {
      background-color: $light-blue;
      color: $blue;
      border-color: $blue;
    }
  }
}

.card_tab__contents {
  list-style: none;
}

.info__list {
  display: flex;
  flex-wrap: wrap;
  // gap: 10px;
  & > li {
    width: 50%;
    border-bottom: 1px dotted $light;
    @include flex-start;
    font-size: 14px;
    gap: 5px;
    padding: 15px 0;

    span {
      font-weight: 500;
      max-width: 400px;
    }
  }
}

.card_tab__content {
  padding: 20px;
  padding-bottom: 40px;
  font-weight: 400;
}

.card_bottom__left {
  @include flex-start;
  gap: 10px;
}

.card_bottom__right {
  @include flex-end;
  gap: 20px;
}

.card_bottom {
  @include flex-space;
  gap: 20px;
  padding: 0 20px 20px 20px;
}

.card__view,
.card__kp {
  @include flex-start;
  gap: 5px;
  font-size: 12px;
  background-color: $ulight;
  padding: 7px 10px;
  border-radius: 4px;
  transition: all 0.3s ease-in-out;
  font-weight: 500;
  &:hover {
    background-color: $light;
  }
}
.card_link__btn {
  @include flex-start;
  font-size: 12px;
  font-weight: 500;
  background-color: $ulight;
  padding: 0 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  &:hover {
    background-color: $light;
  }
}

.list_item__full {
  width: 100% !important;
  align-items: flex-start !important;
  gap: 10px !important;
}

.box__list {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  list-style: none;
  font-size: 14px;
  font-weight: 500;
  gap: 5px;
  padding: 5px 10px;
  border-radius: 5px;
  margin-top: -10px;

  li {
    background-color: $white;
    border-bottom: 1px solid $light;
    padding: 5px 10px;
  }
}

.history_list {
  flex-direction: column;
}
.history_item {
  width: 100% !important;
  border-color: transparent !important;
  // align-items: flex-end !important;
  gap: 20px !important;

  &.comment {
    flex-direction: column;
    align-items: flex-start !important;
  }

  &:deep(.dp__input_icon) {
    display: none;
  }
  &:deep(.dp__input_icon_pad) {
    border-bottom: 1px solid $light;
    border-width: 0 0 1px 0;
    border-radius: 0;
    padding: 15px 40px;
    font-size: 18px;
  }

  textarea {
    width: 100%;
    border: 1px solid $light;
    padding: 10px 20px;
    border-radius: 5px;
    font-size: 16px;
    font-weight: 500;
    min-height: 200px;
    margin-bottom: 10px;
  }
}

.history_item__top {
  width: 100%;
  @include flex-start;
  gap: 10px;
  font-size: 16px;
  font-weight: 500;
  border-bottom: 1px solid $light;
  padding-bottom: 20px;
  margin-bottom: 20px;
}

.item_head {
  @include flex-start;
  gap: 10px;
  font-size: 16px;
  font-weight: 500;
}

.input_date {
  position: relative;
  width: 100%;
  svg {
    position: absolute;
    top: 47%;
    left: 0px;
    transform: translateY(-50%);
    pointer-events: none;
    color: #7a7a7a !important;
  }
}

.comment_list {
  display: flex;
  flex-direction: column;
  list-style: none;
  font-size: 14px;
  gap: 10px;
  width: 100%;
  margin-bottom: 20px;
  li {
    display: inline-flex;
    &:nth-child(2n) {
      justify-content: flex-end;
    }
    p {
      max-width: 50%;
      border-radius: 5px;
      padding: 10px 20px;
      background-color: $light;
    }
  }
}

.send_comment {
  @include flex-center;
  display: inline-flex;
  background-color: $blue;
  color: $white;
  cursor: pointer;
  padding: 15px 40px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 10px;
  gap: 10px;
  transition: all 0.3s ease-in-out;
  &:hover {
    background-color: $hover;
  }

  svg {
    color: $white !important;
  }
}
</style>
