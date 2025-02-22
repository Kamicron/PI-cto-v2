<template>
  <div class="image-card">
    <div class="image-card__delete" @click="onDelete">
      <font-awesome-icon :icon="['fas', 'trash-can']" />
    </div>
    <div class="image-card__container" @click="$emit('imageClick')">
      <img :src="transparentBgSrc" alt="Transparent background" class="image-card__background" />
      <img :src="src" :alt="alt" class="image-card__img" />
    </div>
    <div class="image-card__footer">
      <p class="image-card__footer--name" v-if="!isEditingName" @click="startEditing">
        {{ namefile }}
      </p>
      <input v-else class="image-card__footer--name-input" v-model="newName" @keyup.enter="handleExtensionChange"
        @blur="cancelEditing" placeholder="Nouveau nom" />
      <div class="link-container">
        <NuxtLink class="link-container__link" :to="src" :title="src" target="_blank">{{ shortUrl }}</NuxtLink>
        <pi-button class="link-container__copy-buton" @click="copyLink(srcfile)" label="Copier" tiny
          :icon="['far', 'copy']" />
      </div>
      <div v-if="copiedMessage" class="image-card__footer--dialog">Lien copié !</div>
    </div>
  </div>

  <modal title="Attention" :isOpen="isWarningExtension" @close="isWarningExtension = false" max-width="600px">
    <div class="modal-actions">
      <p>{{ warningMessage }}</p>

      <div class="modal-actions__button">
        <pi-button tiny bg-color="#28a745" @click="confirmRename" :icon="['far', 'floppy-disk']" label="Sauvegarder" />
        <pi-button tiny bg-color="#dc3545" @click="cancelRename" :icon="['fas', 'xmark']" label="Annuler" />
      </div>

    </div>
  </modal>
</template>



<script setup lang="ts">
// ----- Import -----
import { onMounted, ref } from "vue";
import { useNuxtApp } from "#app";
import { useRuntimeConfig } from "nuxt/app";
import { EToast } from "vue3-modern-toast";
import { useAxiosError } from '../../composables/useAxiosError';
// ------------------

// ----- Define -----
const props = defineProps({
  id: {
    type: String,
    required: true
  },
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    required: true
  },
});

const emit = defineEmits(['delete', 'imageClick'])
// ------------------

// ------ Const -----
const transparentBgSrc = "http://api.pi-cto.top/uploads/16d20c54-45bf-4dba-bbc1-9e377f7c224e/1733761480896-transparent.jpg";
const { $api } = useNuxtApp();
const { public: config } = useRuntimeConfig()
const apiUrl = config.apiBaseUrl;
const { getErrorMessage } = useAxiosError();
const { $toast } = useNuxtApp()
// ------------------

// ---- Reactive ----
const shortUrl = ref<string>('')
const isEditingName = ref<boolean>(false);
const newName = ref<string>('');
const copiedMessage = ref<boolean>(false);
const namefile = ref<string>(props.name)
const srcfile = ref<string>(props.src)
const isWarningExtension = ref<boolean>(false)
const warningMessage = ref('');
const newNameConfirmed = ref('');
// ------------------

// ------ Hooks -----
onMounted(() => {
  shortUrl.value = truncateMiddle(srcfile.value, 28)
})
// ------------------

// --- Async Func ---
async function copyLink(item: string) {
  try {
    await navigator.clipboard.writeText(item);
    copiedMessage.value = true;

    setTimeout(() => {
      copiedMessage.value = false;
    }, 3000);
  } catch (error) {
    $toast.show({
      message: getErrorMessage(error),
      type: EToast.WARNING,
      duration: 3000,
      dismissible: true,
    })
  }
}

async function renameImage() {
  try {
    const { data } = await $api.patch(`/images/${props.id}/rename`, {
      newName: newName.value,
    });

    namefile.value = data.updatedPhoto.name;
    srcfile.value = `${apiUrl}/uploads/${data.updatedPhoto.folder.id}/${data.updatedPhoto.name}`;

    isEditingName.value = false;

    console.log('test');
    

    $toast.show({
      message: 'Image renommée avec succés',
      type: EToast.SUCCESS,
      duration: 3000,
      dismissible: true,
      icon: '✨'
    })

  } catch (error) {
    $toast.show({
      message: getErrorMessage(error),
      type: EToast.ERROR,
      duration: 3000,
      dismissible: true,
      icon: '⛔'
    })
  }
}
// ------------------

// ---- Function ----
function onDelete() {
  emit('delete');
}

function truncateMiddle(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;

  const start = text.slice(0, Math.ceil(maxLength / 2) - 1);
  const end = text.slice(-Math.floor(maxLength / 2));
  return `${start}[...]${end}`;
}

function startEditing() {
  isEditingName.value = true;
  newName.value = namefile.value;
}

function cancelEditing() {
  isEditingName.value = false;
  newName.value = '';
}

function validateNewName(newName: string, currentName: string): boolean {
  const extensionRegex = /\.[a-zA-Z0-9]+$/;
  if (!extensionRegex.test(newName)) {
    $toast.show({
      message: 'Le nouveau nom doit inclure une extension valide.',
      type: EToast.WARNING,
      duration: 3000,
      dismissible: true,
      icon: '✨'
    })

    return false;
  }

  return true;
}

function getExtension(fileName: string): string {
  const match = fileName.match(/\.[a-zA-Z0-9]+$/);
  return match ? match[0] : '';
}

function handleExtensionChange() {
  const currentExtension = getExtension(namefile.value);
  const newExtension = getExtension(newName.value);

  if (!validateNewName(newName.value, namefile.value)) {
    return;
  }

  if (currentExtension !== newExtension) {
    warningMessage.value = `Vous êtes sur le point de changer l'extension de "${currentExtension}" à "${newExtension}". Voulez-vous continuer ?`;
    newNameConfirmed.value = newName.value;
    isWarningExtension.value = true;
  } else {
    renameImage();
  }
}

function confirmRename() {
  newName.value = newNameConfirmed.value;
  isWarningExtension.value = false;
  renameImage();
}

function cancelRename() {
  isWarningExtension.value = false;
  newName.value = '';
}
// ------------------
</script>

<style lang="scss" scoped>
.image-card {
  position: relative;
  width: 280px;
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
  cursor: pointer;

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
    z-index: 10;

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

  &__container {
    position: relative;
    width: 100%;
    padding-top: 100%;
    overflow: hidden;

    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: $border-radius;

    }
  }


  &__background {
    z-index: 1;
  }

  &__img {
    z-index: 2;
  }

  &__img {
    max-width: 100%;
    border-radius: $border-radius;
    margin-bottom: 8px;
  }


  &__img {
    position: relative;
    z-index: 2;
    max-width: 100%;
    border-radius: $border-radius;
    margin-bottom: 8px;
  }

  &--background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: auto;
    opacity: 0.7;
    z-index: 1;
    pointer-events: none;
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

    .link-container {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 20px;

      &__link {
        color: $primary-color;
        text-decoration: none;

        :hover {
          text-decoration: underline;
        }
      }
    }

    &--dialog {
      position: absolute;
      bottom: 30px;
      right: -10px;
      transform: translate(-50%, -50%);
      background-color: rgba(49, 124, 194, 0.9);
      color: white;
      padding: 8px 16px;
      border-radius: $border-radius;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      font-size: 14px;
      animation: fadeOut 3s forwards;
      z-index: 10;
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

.modal-actions {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 20px;

  &__button {
    display: flex;
    justify-content: center;
    gap: 20px;
  }
}
</style>