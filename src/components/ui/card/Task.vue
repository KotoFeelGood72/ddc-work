<template>
  <div class="task">
    <div class="task_head">
      <p>Создание видео-курса</p>
      <div class="task_head__more">
        <Icons icon="pepicons-pencil:dots-x" />
      </div>
    </div>
    <div class="task_body">Срок: 5 дней</div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.task {
  background-color: $light;
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.task_head {
  @include flex-space;
  gap: 20px;
}
</style>
