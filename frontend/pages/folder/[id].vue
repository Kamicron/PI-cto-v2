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
        <img :src="`http://localhost:5000/uploads/${photo.url}`" :alt="photo.name" />
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
// ------------------

// ------ Type ------

// ------------------

// ----- Define -----

// ------------------

// ------ Const -----
const route = useRoute();
const router = useRouter();
const folderId = route.params.id;
// ------------------

// ---- Reactive ----
const folder = ref();
const photos = ref([]);
const folderName = ref<string>('')
const isModifyFolderName = ref<boolean>(false)
const { $api } = useNuxtApp();

// ------------------

// ---- Computed ----

// ------------------

// ------ Hooks -----
onMounted(async () => {
  try {
    const { data } = await $api.get(`/folders/${folderId}`);
    folder.value = data || { name: '', children: [], parent: null }; // Initialisation par défaut
    photos.value = data.photos || [];
    folderName.value = data.name
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
  }
});
// ------------------

// --- Async Func ---
async function modifyFolderName() {
console.log(folderName.value);
const { data } = await $api.patch(`/folders/${folderId}/name`, {name: folderName.value})
if(!data) return
  folderName.value = data.name
  
  isModifyFolderName.value = false
}
// ------------------

// ---- Function ----
function goToParentFolder() {
  if (folder.value.parent) {
    router.push(`/folder/${folder.value.parent.id}`);
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