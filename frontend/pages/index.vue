<template>
  <div v-if="!isLoggedIn">Connectez-vous</div>
  <div class="folder" v-else-if="folder">
    <div v-if="folder.name && !isModifyFolderName" style="display: flex;">
      <h1>{{ folder.name }}</h1>
      <PiButton label="test" />

      <button @click="isModifyFolderName = true"><font-awesome-icon :icon="['fas', 'pen']" /></button>
    </div>
    <div v-if="isModifyFolderName">
      <input type="text" v-model="folderName">
      <button @click="modifyFolderName">Modifier</button>
    </div>

    <button v-if="folder.parent" @click="goToParentFolder">
      <font-awesome-icon class="back-folder" :icon="['fas', 'right-from-bracket']" />
    </button>


    <h2>Sous-dossiers</h2>
    <div class="SubFolder" v-if="folder.children && folder.children.length">
      <PIFolder v-for="child in folder.children" :key="child.id" :folder="child" />

    </div>
    <p v-else>Aucun sous-dossier.</p>

    <h2>Photos</h2>
    <div class="folder__images">
      <div v-for="photo in photos" :key="photo.id" class="folder__image">
        <img :src="`http://localhost:5000/uploads/${photo.url}`" :alt="photo.name" />
        <p>{{ photo.name }}</p>
      </div>
    </div>
  </div>
  <loader v-else />
</template>


<script setup lang='ts'>
// ----- Import -----
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useNuxtApp } from "#app";
import { useAuthStore } from "@/stores/auth";
import { watch } from "vue";
import { EToast } from "vue3-modern-toast";
import { useAxiosError } from '../composables/useAxiosError';
// ------------------

// ------ Type ------

// ------------------

// ----- Define -----

// ------------------

// ------ Const -----
const router = useRouter();
const folderId = '';
const authStore = useAuthStore();
const { getErrorMessage } = useAxiosError();
const { $toast } = useNuxtApp()
// ------------------

// ---- Reactive ----
const folder = ref();
const folderName = ref<string>('')
const photos = ref([]);
const isModifyFolderName = ref<boolean>(false)
const { $api } = useNuxtApp();
const isLoggedIn = ref(authStore.isLoggedIn);
// ------------------

// ---- Computed ----

// ------------------

// ------ Hooks -----

// ------------------

// --- Async Func ---

async function modifyFolderName() {
  console.log('folderName.value');
  try {
    const { data } = await $api.patch(`/folders/${folderId}/name`, { name: folderName.value })
    folderName.value = data.name

    isModifyFolderName.value = false

    console.log('Nom de la dossier modifié avec succès');

    $toast.show({
      message: 'Nom de la dossier modifié avec succès',
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
  }
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
watch(
  () => authStore.isLoggedIn,
  async (isLoggedIn) => {
    if (isLoggedIn) {

      try {
        const { data } = await $api.get(`/folders/${folderId}`, {
          headers: { Authorization: `Bearer ${authStore.token}` },
        });
        folder.value = data || { name: "", children: [], parent: null };
        photos.value = data.photos || [];
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
      }
    } else {
      folder.value = null;
      photos.value = [];
    }
  },
  { immediate: true }
);



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

.SubFolder {
  display: flex;
  gap: 20px
}

.back-folder {
  rotate: 180Deg;
}
</style>