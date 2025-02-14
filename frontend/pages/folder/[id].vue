<template>
  <div class="folder" v-if="folder">
    <div v-if="folderName && !isModifyFolderName" class="folder__name">
      <h1>{{ folderName }}</h1>

      <pi-button label="éditer" :icon="['fas', 'pen']" tiny @click="isModifyFolderName = true" />

      <!-- <button @click="isModifyFolderName = true"><font-awesome-icon :icon="['fas', 'pen']" /></button> -->
    </div>
    <div v-if="isModifyFolderName">
      <input type="text" v-model="folderName">
      <button @click="modifyFolderName">Modifier</button>
    </div>

    <PiButton v-if="folder.parent" @click="goToParentFolder" :bgColor="'#3f556d'" label="Dossier parent"
      :icon="['fas', 'right-from-bracket']" tiny />


    <p>{{ errorMessage }}</p>

    <div class="folder__subfolder">
      <h2>Sous-dossiers</h2>

      <PiButton @click="openModal" :icon="['fas', 'folder-plus']" label="Ajouter un dossier" tiny />
      <div class="SubFolder" v-if="folder.children && folder.children.length">
        <PIFolder v-for="child in folder.children" :key="child.id" :folder="child" />
      </div>
      <p v-else>Aucun sous-dossier.</p>
    </div>

    <h2>Photos</h2>
    <div class="folder__images-container">
      <div class="folder__images">
        <image-card class="folder__images--card" v-for="photo in photos" :key="photo.id"
          :src="`${apiUrl}/uploads/${photo.url}`" :alt="photo.name" :name="photo.name" :id="photo.id"
          @delete="deletePhoto(photo.id)" />
      </div>
    </div>

    <uploader :folderId="folderId" @upload="fetchFolder()" />

  </div>
  <loader v-else />

  <modal :isOpen="isModalOpen" maxWidth="800px" title="Ajouter un nouveau dossier" @close="isModalOpen = false">
    <div class="addFolder">
      <div class="addFolder__input">
        <label>Nom du dossier</label>
        <input v-model="nameFolder" type="text" name="nameFolder">
      </div>
      <div class="addFolder__button">
        <pi-button tiny bg-color="#28a745" @click="saveFolder" :icon="['far', 'floppy-disk']" label="Sauvegarder" />
        <pi-button tiny bg-color="#dc3545" @click="isModalOpen = false" :icon="['fas', 'xmark']" label="Annuler" />
      </div>
    </div>
  </modal>

  <modal :isOpen="isOpenPhoto" @close="isOpenPhoto = false">
    <div class="modalPhoto" v-if="selectedPhoto">
      <div class="modalPhoto__file">
        <img :src="selectedPhoto.src" :alt="selectedPhoto.name" class="modalPhoto__file--image" />
      </div>
      <div class="modalPhoto__information">
        <p>nom: <span class="modalPhoto__information--value">{{ selectedPhoto.name }}</span></p>
        <p>url: <span class="modalPhoto__information--value">{{ selectedPhoto.src }}</span></p>
      </div>
    </div>
  </modal>
</template>


<script setup lang='ts'>
// ----- Import -----
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useNuxtApp } from "#app";
import { useRuntimeConfig } from "nuxt/app";
import { EToast } from "vue3-modern-toast";
import { useAxiosError } from '../../composables/useAxiosError';

// ------------------

// ------ Type ------
interface ILightFolder {
  id: string;
  createdAt: Date;
  name: string;
}


interface IFolder {
  id: string;
  name: string;
  createdAt: Date;
  children: ILightFolder[];
  parent: ILightFolder | null;
}
// ------------------

// ----- Define -----
// ------------------

// ------ Const -----
const route = useRoute()
const router = useRouter()
const folderId = route.params.id
const { public: config } = useRuntimeConfig()
const apiUrl = config.apiBaseUrl;
const isModalOpen = ref<boolean>(false)
const transparentBgSrc = "http://api.pi-cto.top/uploads/16d20c54-45bf-4dba-bbc1-9e377f7c224e/1733761480896-transparent.jpg";

// ------------------

// ---- Reactive ----
const folder = ref<IFolder>()
const photos = ref([])
const folderName = ref<string>('')
const errorMessage = ref<string>('')
const nameFolder = ref<string>('')

const isModifyFolderName = ref<boolean>(false)
const { $api } = useNuxtApp();
const { getErrorMessage } = useAxiosError();
const { $toast } = useNuxtApp()

// ------------------

// ---- Computed ----

// ------------------

// ------ Hooks -----
onMounted(async () => {
  fetchFolder()
});
// ------------------

async function modifyFolderName() {
  try {
    const { data } = await $api.patch(`/folders/${folderId}/name`, { name: folderName.value })

    if (!data) {
      $toast.show({
      message: 'Une erreur est survenue, aucune donnée retournée.',
      type: EToast.WARNING,
      duration: 3000,
      dismissible: true,
      icon: '✨'
    })
      errorMessage.value = 'Une erreur est survenue, aucune donnée retournée.'
      return
    }

    folderName.value = data.name

    isModifyFolderName.value = false

    $toast.show({
      message: 'Nom du dossier modifié avec succès',
      type: EToast.SUCCESS,
      duration: 3000,
      dismissible: true,
      icon: '✨'
    })
  } catch (error: any) {
    $toast.show({
      message: getErrorMessage(error),
      type: EToast.ERROR,
      duration: 3000,
      dismissible: true,
      icon: '⛔'
    })

    if (error.response && error.response.data && error.response.data.message) {
      errorMessage.value = error.response.data.message
    } else {
      errorMessage.value = 'Une erreur inconnue est survenue.'
    }
  }
}

async function createFolder() {
  if (!nameFolder.value || nameFolder.value.trim().length < 3) {
    errorMessage.value = "Le nom du dossier doit contenir au moins 3 caractères.";
    return;
  }

  try {
    const { data } = await $api.post("/folders/create", {
      name: nameFolder.value.trim(),
      parentId: folderId,
    });

    nameFolder.value = ""

    fetchFolder()
    $toast.show({
      message: 'Dossier créé avec succès',
      type: EToast.SUCCESS,
      duration: 3000,
      dismissible: true,
      icon: '✨'
    })
  } catch (error: any) {
    $toast.show({
      message: getErrorMessage(error),
      type: EToast.ERROR,
      duration: 3000,
      dismissible: true,
      icon: '⛔'
    })
    errorMessage.value = error.response?.data?.message || "Une erreur est survenue.";
  }
}

async function deletePhoto(photoId: string) {
  try {
    const { data } = await $api.delete(`/images/${photoId}`);

    if (data.success) {
      photos.value = photos.value.filter(photo => photo.id !== photoId);
    }

    $toast.show({
      message: 'Image supprimée avec succès',
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

async function fetchFolder() {
  try {
    const { data } = await $api.get(`/folders/${folderId}`)
    folder.value = data || { name: '', children: [], parent: null }
    photos.value = data.photos || []
    folderName.value = data.name
    console.log('folder.value', folder.value);

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
function goToParentFolder() {
  if (folder.value.parent) {
    router.push(`/folder/${folder.value.parent.id}`)
  }
}

function openModal() {
  isModalOpen.value = true
}

function saveFolder() {
  createFolder()
  isModalOpen.value = false
}

function openPhotoModal(photo: { src: string; name: string }) {
  selectedPhoto.value = photo;
  isOpenPhoto.value = true;
}
// ------------------

// ------ Watch -----
watch(
  () => nameFolder.value,
  (newVal) => {
    console.log('newVal:', newVal)
  }
);
// ------------------

</script>

<style lang='scss' scoped>
.folder {
  &__name {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
  }

  &__images-container {
    margin-left: 20px;
  }

  &__images {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 20px;

    &--card {
      flex: 1 1 calc(33.333% - 20px);
      max-width: calc(33.333% - 20px);
      min-width: 200px;
      margin: 0;

      @media (max-width: 768px) {
        flex: 1 1 calc(50% - 20px);
        max-width: calc(50% - 20px);
      }

      @media (max-width: 480px) {
        flex: 1 1 100%;
        max-width: 100%;
      }
    }
  }

  &__subfolder {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__image {
    width: 150px;
    text-align: center;

    img {
      max-width: 100%;
      border-radius: 8px;
    }
  }
}

.addFolder {
  display: flex;
  flex-direction: column;
  gap: 20px;

  &__input {
    display: flex;
    flex-direction: column;
    gap: 5px
  }

  &__button {
    display: flex;
    gap: 10px;
    justify-content: center;
    align-items: center;
  }

}

.SubFolder {
  display: flex;
  gap: 20px
}

.back-folder {
  rotate: 180Deg;
}

.modalPhoto {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  gap: 20px;

  &__file {
    height: 70vh;
    width: auto;
    display: flex;
    justify-content: center;
    align-items: center;

    margin: 10px;


    &--image {
      max-height: 100%;
      max-width: 100%;
      border-radius: 8px;
      object-fit: contain;
      border-radius: $border-radius;
      border: 1px solid $dark-color;
      box-shadow: $box-shadow;
    }
  }

  &__information {
    display: flex;
    flex-direction: column;
    gap: 5px;
    align-items: start;

    &--value {
      color: $dynamic-color;
    }
  }
}
</style>