<template>
  <div class="chart__w">
    <ApexChart type="bar" height="420" :options="chartOptions" :series="series" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import ApexChart from "vue3-apexcharts";

// Данные для графика
const series = ref([
  {
    name: "PL",
    data: [1000, 2000, 3100, 400, 200, 600, 500],
  },
  {
    name: "Avg",
    data: [500, 900, 1300, 400, 100, 400, 90],
  },
  {
    name: "Inc",
    data: [300, 400, 700, 500, 200, 300, 100],
  },
]);

// Настройки графика
const chartOptions = ref({
  chart: {
    type: "bar",
    height: 420,
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "55%",
      endingShape: "rounded",
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 2,
    colors: ["transparent"],
  },
  xaxis: {
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  },
  yaxis: {
    title: {
      text: "Amount",
    },
  },
  fill: {
    opacity: 1,
  },
  tooltip: {
    y: {
      formatter: (val: number) => `\$${val}`,
    },
  },
  colors: ["#90e0ef", "#0096c7", "#48cae4"], // Цвета для каждой серии
  markers: {
    size: 5,
    colors: ["#e76f51"], // Цвет маркера
    strokeWidth: 2,
    strokeDashArray: 6,
  },
});
</script>

<style lang="scss" scoped>
.chart__w {
  background-color: $ulight;
  border-radius: 5px;
  overflow: hidden;
}
</style>
