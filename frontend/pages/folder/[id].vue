<template>
  <div class="folder" v-if="folder">
    <h1>{{ folder.name }}</h1>
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
const folder = ref({});
const photos = ref([]);
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