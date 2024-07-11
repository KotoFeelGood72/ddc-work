<template>
  <div class="input">
    <div class="input__w">
      <div class="input-icon" v-if="icon">
        <SvgIcon :name="icon" />
      </div>
      <input
        :type="passwordVisible ? 'text' : 'password'"
        :placeholder="placeholder"
        autocomplete="false"
      />
      <button type="button" class="toggle-visibility" @click="togglePasswordVisibility">
        <SvgIcon :name="passwordVisible ? 'visible' : 'novisible'" />
      </button>
    </div>
    <span v-if="error" class="input-message">{{ message }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

withDefaults(
  defineProps<{
    placeholder?: string;
    message?: string;
    error?: boolean;
    icon: string;
  }>(),
  {
    placeholder: "Create Password",
    message: "",
    error: false,
    icon: "lock",
  }
);

const passwordVisible = ref(false);

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
};
</script>

<style scoped lang="scss">
.input {
  width: 100%;
}
.input__w {
  border: 1px solid $bg-color-secondary;
  border-radius: 15px;
  @include flex-start;
  position: relative;
  overflow: hidden;
  .input-icon {
    position: absolute;
    top: 50%;
    left: 15px;
    transform: translateY(-50%);
  }

  input {
    appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;
    width: 100%;
    padding: 16px 15px 16px 50px;
    font-size: $body-2;
    &:focus {
      outline: none;
    }
  }
}

.toggle-visibility {
  margin-right: 15px;
}
</style>
