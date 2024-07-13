<template>
  <div class="qr-code-container">
    <h3 class="qr_title">
      Номер телефона:
      <span class="qr__phone">
        {{ decodedPhone }}
        <div class="clipboard" @click="handleCopy">
          <Icons
            icon="solar:clipboard-linear"
            size="18px"
            color="#424242"
            hoverColor="#ff9800"
          />
        </div>
        <span v-if="showCopiedMessage" class="copied-message">Скопировано!</span>
      </span>
    </h3>
    <div v-if="valueToEncode" class="qr-code">
      <canvas ref="qrcodeCanvas"></canvas>
    </div>
    <div v-else>
      <p>No phone number or URL provided in query parameters.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick, computed } from "vue";
import { useRoute } from "vue-router";
import { toCanvas } from "qrcode";

const route = useRoute();
const qrcodeCanvas = ref<HTMLCanvasElement | null>(null);
const valueToEncode = ref<string | null>(null);
const showCopiedMessage = ref(false);

const decodedPhone = computed(() => {
  return route.query.phone ? decodeURIComponent(route.query.phone as string) : null;
});

const generateQRCode = () => {
  if (valueToEncode.value && qrcodeCanvas.value) {
    console.log("Generating QR code for:", valueToEncode.value);
    toCanvas(
      qrcodeCanvas.value,
      valueToEncode.value,
      { width: 300, margin: 2 },
      (error: any) => {
        if (error) {
          console.error("Error generating QR code:", error);
        } else {
          console.log("QR code generated successfully");
        }
      }
    );
  }
};

const updateValueToEncode = () => {
  const phone = decodedPhone.value;
  const url = route.query.url ? decodeURIComponent(route.query.url as string) : null;
  console.log("Decoded phone:", phone);
  console.log("Decoded url:", url);

  if (phone) {
    valueToEncode.value = `tel:${phone}`;
  } else if (url) {
    valueToEncode.value = url;
  } else {
    valueToEncode.value = null;
  }

  nextTick(() => {
    generateQRCode();
  });
};

const copyToClipboard = (text: string | null) => {
  if (text) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log(`Copied to clipboard: ${text}`);
        showCopiedMessage.value = true;
        setTimeout(() => {
          showCopiedMessage.value = false;
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  }
};

const handleCopy = () => {
  copyToClipboard(decodedPhone.value);
  const clipboardElement = document.querySelector(".clipboard");
  clipboardElement?.classList.add("active");
  setTimeout(() => {
    clipboardElement?.classList.remove("active");
  }, 500);
};

onMounted(() => {
  updateValueToEncode();
});

watch(
  () => route.query,
  () => {
    updateValueToEncode();
  },
  { deep: true }
);
</script>

<style scoped lang="scss">
.qr-code-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
  padding: 30px 60px 0 60px;
}

.qr_title {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 10px;

  .qr__phone {
    display: flex;
    align-items: center;
    gap: 10px;
    border: 1px solid #ff9800;
    padding: 7px 20px;
    border-radius: 8px;
    position: relative;
    font-size: 14px;
  }
}

.clipboard {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;

  &.active {
    animation: ripple 0.5s linear;
  }
}

@keyframes ripple {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.copied-message {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: calc(100% + 8px);
  background-color: $secondary-orange;
  color: #424242;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  @include flex-center;
  animation: fadeInOut 2s forwards;
  z-index: 99;
}

@keyframes fadeInOut {
  0%,
  100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}
</style>
