<template>
  <div class="image-card">
    <div class="image-card__delete" @click="onDelete">
      <font-awesome-icon :icon="['fas', 'trash-can']" />
    </div>
    <img :src="src" :alt="alt" class="image-card__img" />
    <div class="image-card__footer">
      <p class="image-card__footer--name">{{ name }}</p>
      <pi-button @click="copyLink(src)" label="Url" tiny :icon="['far', 'copy']" />
      <div v-if="copiedMessage" class="image-card__footer--dialog">Lien copié !</div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";


defineProps({
  src: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['delete'])


function onDelete() {
  emit('delete');
}

const copiedMessage = ref<boolean>(false);

async function copyLink(item: string) {
  try {
    await navigator.clipboard.writeText(item);
    copiedMessage.value = true;

    setTimeout(() => {
      copiedMessage.value = false;
    }, 3000);
  } catch (error) {
    console.error('Erreur lors de la copie du lien :', error);
  }
}
</script>

<style lang="scss" scoped>
.image-card {
  position: relative;
  width: 150px;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: $border-radius;
  padding: 8px;
  background-color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  &__delete {
    position: absolute;
    top: 8px;
    right: 8px;
    cursor: pointer;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.4);
    border-radius: 50%;
    padding: 6px;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    transition: background 0.3s ease, backdrop-filter 0.3s ease, box-shadow 0.3s ease;

    svg {
      font-size: 14px;
      color: $danger-color;
    }

    &:hover {
      background: rgba(255, 255, 255, 0.6);
      backdrop-filter: blur(15px);
      -webkit-backdrop-filter: blur(15px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    }
  }

  &__img {
    max-width: 100%;
    border-radius: $border-radius;
    margin-bottom: 8px;
  }

  &__footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    
    &--name {
      font-size: 14px;
      color: #555;
      word-break: break-word;
    }

    &--dialog {
    position: absolute;
    bottom: 20px;
    left: 60px;
    transform: translate(-50%, -50%);
    background-color: rgba(49, 124, 194, 0.9);
    color: white;
    padding: 8px 16px;
    border-radius: $border-radius;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    font-size: 14px;
    animation: fadeOut 3s forwards;
  }
  }

  &__copy {
    background-color: #417fc0;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 5px 10px;
    font-size: 12px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #306baa;
    }
  }



  @keyframes fadeOut {
    0% {
      opacity: 1;
    }

    80% {
      opacity: 1;
    }

    100% {
      opacity: 0;
    }
  }
}
</style>