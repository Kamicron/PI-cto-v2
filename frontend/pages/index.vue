<template>
  <div class="folders">
    <h1>Liste des dossiers</h1>
    <ul>
      <li v-for="folder in folders" :key="folder.id">
        <NuxtLink :to="`/folder/${folder.id}`">{{ folder.name }}</NuxtLink>
      </li>
    </ul>
  </div>
</template>


<script setup lang='ts'>
// ----- Import -----
import { ref, onMounted } from 'vue';
import { useNuxtApp } from '#app';
// ------------------

// ------ Type ------

// ------------------

// ----- Define -----

// ------------------

// ------ Const -----
const folders = ref([]);
const { $api } = useNuxtApp();
// ------------------

// ---- Reactive ----

// ------------------

// ---- Computed ----

// ------------------

// ------ Hooks -----
onMounted(async () => {
  try {
    const { data } = await $api.get('/folders'); // Récupère la liste des dossiers depuis l'API
    folders.value = data;
  } catch (error) {
    console.error('Erreur lors de la récupération des dossiers :', error);
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
.folders {
  ul {
    list-style-type: none;
    padding: 0;

    li {
      margin: 10px 0;

      a {
        color: blue;
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
</style>