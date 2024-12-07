<template>
  <div class="folder" v-if="folder">
    <div v-if="folderName && !isModifyFolderName" style="display: flex;">
      <h1>{{ folderName }}</h1>
            
      <button @click="isModifyFolderName = true"><font-awesome-icon :icon="['fas', 'pen']" /></button>
    </div>
    <div v-if="isModifyFolderName">
      <input type="text" v-model="folderName">
      <button @click="modifyFolderName">Modifier</button>
    </div>    
    <button v-if="folder.parent" @click="goToParentFolder">Retour au dossier parent</button>

    <p>{{ errorMessage }}</p>

    <h2>Sous-dossiers</h2>
    <ul v-if="folder.children && folder.children.length">
      <li v-for="child in folder.children" :key="child.id">
        <NuxtLink :to="`/folder/${child.id}`">{{ child.name }}</NuxtLink>
      </li>
    </ul>
    <p v-else>Aucun sous-dossier.</p>

    <h2>Photos</h2>
    <div class="folder__images">
      <div v-for="photo in photos" :key="photo.id" class="folder__image">
        <img :src="`${apiUrl}/uploads/${photo.url}`" :alt="photo.name" />
        <p>{{ photo.name }}</p>
      </div>
    </div>

    <h2>Uploader des images</h2>
    <form @submit.prevent="uploadImages">
      <input type="file" ref="fileInput" multiple />
      <button type="submit">Uploader</button>
    </form>
  </div>
  <p v-else>Chargement...</p>
</template>


<script setup lang='ts'>
// ----- Import -----
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useNuxtApp } from "#app";
import { useRuntimeConfig } from "nuxt/app";
// ------------------

// ------ Type ------

// ------------------

// ----- Define -----

// ------------------

// ------ Const -----
const route = useRoute()
const router = useRouter()
const folderId = route.params.id
const { public: config } = useRuntimeConfig()
const apiUrl = config.apiBaseUrl;

// ------------------

// ---- Reactive ----
const folder = ref()
const photos = ref([])
const folderName = ref<string>('')
  const errorMessage = ref<string>('')
  
const isModifyFolderName = ref<boolean>(false)
const { $api } = useNuxtApp();

// ------------------

// ---- Computed ----

// ------------------

// ------ Hooks -----
onMounted(async () => {
  try {
    const { data } = await $api.get(`/folders/${folderId}`)
    folder.value = data || { name: '', children: [], parent: null }
    photos.value = data.photos || []
    folderName.value = data.name
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error)
  }
});
// ------------------

// --- Async Func ---
async function modifyFolderName() {
  try {    
    const { data } = await $api.patch(`/folders/${folderId}/name`, { name: folderName.value })

    if (!data) {
      errorMessage.value = 'Une erreur est survenue, aucune donnée retournée.'
      return
    }

    folderName.value = data.name
    
    isModifyFolderName.value = false

  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage.value = error.response.data.message
    } else {
      errorMessage.value = 'Une erreur inconnue est survenue.'
    }
  }
}

async function uploadImages() {
  try {
    const inputElement = document.querySelector('input[type="file"]') as HTMLInputElement;

    if (!inputElement || !inputElement.files || inputElement.files.length === 0) {
      errorMessage.value = "Veuillez sélectionner un ou plusieurs fichiers.";
      return;
    }

    const formData = new FormData();

    for (const file of inputElement.files) {
      formData.append('file', file);
    }

    await $api.post(`/images/${folderId}/upload`, formData);

    // Recharge les photos après upload
    await fetchPhotos();

    inputElement.value = ""; // Réinitialiser le champ de fichier
  } catch (error) {
    console.error("Erreur lors de l'upload des images :", error);
    errorMessage.value = "Une erreur est survenue lors de l'upload des images.";
  }
}
// ------------------

// ---- Function ----
function goToParentFolder() {
  if (folder.value.parent) {
    router.push(`/folder/${folder.value.parent.id}`)
  }
}
// ------------------

// ------ Watch -----

// ------------------

</script>

<style lang='scss' scoped>
.folder {
  &__images {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
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
</style>