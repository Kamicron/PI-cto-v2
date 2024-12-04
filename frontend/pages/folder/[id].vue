<template>
  <div class="folder">
    <h1>{{ folder.name }}</h1>
    <div class="folder__images">
      <div v-for="photo in photos" :key="photo.id" class="folder__image">
        <img :src="`http://localhost:5000/uploads/${photo.url}`" :alt="photo.name" />
        <p>{{ photo.name }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
// ----- Import -----
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useNuxtApp } from '#app';
// ------------------

// ------ Type ------

// ------------------

// ----- Define -----

// ------------------

// ------ Const -----
const route = useRoute();
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
    folder.value = data;
    photos.value = data.photos;
    console.log('data', data)
    console.log(' folder.value',  folder.value)

    console.log(' photos.value',  photos.value)
  } catch (error) {
    console.error('Erreur lors de la récupération des images :', error);
  }
});
// ------------------

// --- Async Func ---

// ------------------

// ---- Function ----

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