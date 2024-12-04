<template>
  <div class="folder" v-if="folder">
    <div v-if="folder.name && !isModifyFolderName" style="display: flex;">
      <h1>{{ folder.name }}</h1>
            
      <button @click="isModifyFolderName = true"><font-awesome-icon :icon="['fas', 'pen']" /></button>
    </div>
    <div v-if="isModifyFolderName">
      <input type="text">
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
const router = useRouter();
const folderId = '495e09c7-e09d-481e-9c29-ae62e58fc25b';
// ------------------

// ---- Reactive ----
const folder = ref();
const photos = ref([]);
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
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
  }
});
// ------------------

// --- Async Func ---

async function modifyFolderName() {

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