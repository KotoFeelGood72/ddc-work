<template>
  <div class="empty-page">
    <div class="empty-img">
      <img src="../../assets/img/empty/empty-document.png" alt="" />
    </div>
    <div class="empty-content">
      <heading title="Данный раздел в разработке" size="4" />
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.empty-img {
  max-width: 250px;
  @include flex-center;
  margin-bottom: 20px;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
.empty-page {
  @include flex-center;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
</style>
