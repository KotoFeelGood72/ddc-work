<template>
  <div class="dashboard">
    <h1>Стартовая страница</h1>
    <div class="dashboard_grid">
      <div class="dashboard_col">
        <ul class="card_view_statistic">
          <li v-for="(item, i) in stat1" :key="'card-view-statistic-' + i">
            <CardViewStatistic :card="item" />
          </li>
        </ul>
        <BarChart />
      </div>
      <div class="dashboard_small__col">
        <CircleChart />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CardViewStatistic from "@/components/ui/card/CardViewStatistic.vue";
import BarChart from "@/components/chart/BarChart.vue";
import CircleChart from "@/components/chart/CircleChart.vue";
import { ref } from "vue";

const stat1 = ref<any>([
  {
    name: "Отправлено КП",
    value: "1452",
    icon: "solar:letter-unread-broken",
    total: "2.4",
    description: "За последний месяц",
  },
  {
    name: "Кол-во клиентов",
    value: "21",
    icon: "solar:user-check-broken",
    total: "2.4",
    description: "За последний месяц",
  },
  {
    name: "Кол-во звонков",
    value: "444",
    icon: "solar:phone-calling-rounded-broken",
    total: "2.4",
    description: "За последний месяц",
  },
]);
</script>

<style scoped lang="scss">
.dashboard {
  h1 {
    font-size: 20px;
    margin-bottom: 20px;
  }
}

.dashboard_grid {
  @include flex-start;
  align-items: flex-start;
  gap: 20px;
}

.card_view_statistic {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(30%, 1fr));
  grid-gap: 20px;
  list-style: none;
}

.dashboard_col {
  flex-grow: 1;
  max-width: 60%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.dashboard_small__col {
  max-width: 40%;
}
</style>
