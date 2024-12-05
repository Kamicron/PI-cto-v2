<template>
  <div class="image-card">
    <div class="image-card__delete" @click="onDelete">
      <font-awesome-icon :icon="['fas', 'times']" />
    </div>
    <img :src="src" :alt="alt" class="image-card__img" />
    <p class="image-card__name">{{ name }}</p>
    <button @click="copyLink(src)" class="image-card__copy">
      Url <font-awesome-icon :icon="['far', 'copy']" />
    </button>
    <div v-if="copiedMessage" class="image-card__dialog">Lien copié !</div>
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
  border-radius: 8px;
  padding: 8px;
  background-color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &__delete {
    position: absolute;
    top: 8px;
    right: 8px;
    cursor: pointer;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 50%;
    padding: 4px;
    transition: background-color 0.3s ease;
    width: 20px;
    height: 20px;

    &:hover {
      background-color: rgba(255, 130, 130, 0.4);
    }

    svg {
      font-size: 12px;
      color: #333;
    }
  }

  &__img {
    max-width: 100%;
    border-radius: 4px;
    margin-bottom: 8px;
  }

  &__name {
    font-size: 14px;
    color: #555;
    word-break: break-word;
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

  &__dialog {
    position: absolute;
    bottom: 20px;
    left: 60px;
    transform: translate(-50%, -50%);
    background-color: rgba(49, 124, 194, 0.9);
    color: white;
    padding: 8px 16px;
    border-radius: 6px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    font-size: 14px;
    animation: fadeOut 3s forwards;
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