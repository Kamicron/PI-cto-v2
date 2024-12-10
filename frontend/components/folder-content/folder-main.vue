<template>
  <div class='folder-main'>
    <div v-if="loader">chargement...</div>

    <div v-if="!folder && !loader">
      Sélectionnez un dossier
    </div>

    <div v-else>
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
  </div>
</template>

<script setup lang='ts'>
import { ref, watch  } from "vue";
import { useRouter } from "vue-router";
import { useNuxtApp } from "#app";
import { useAuthStore } from "@/stores/auth";

const props = defineProps({ selectedFolderId: { type: Object, default: () => {} } })

const router = useRouter();
// const folderId = '495e09c7-e09d-481e-9c29-ae62e58fc25b';
const authStore = useAuthStore();

const folder = ref();
const folderId = ref(props.selectedFolderId);
const folderName = ref<string>('')
const loader = ref<boolean>(false)
const photos = ref([]);
const isModifyFolderName = ref<boolean>(false)
const { $api } = useNuxtApp();
const isLoggedIn = ref(authStore.isLoggedIn); 

async function getFolder() {
  console.log('coucou');
  
  try {
    loader.value = true
    const { data } = await $api.get(`/folders/${folderId.value}`)
    folder.value = data || { name: '', children: [], parent: null }
    photos.value = data.photos || []
    folderName.value = data.name
    console.log('folder.value', folder.value);
    loader.value = false

  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error)
  }
}

async function modifyFolderName() {
  console.log(folderName.value);
  const { data } = await $api.patch(`/folders/${folderId}/name`, { name: folderName.value })
  console.log({ data });
  folderName.value = data.name

  isModifyFolderName.value = false
}


function goToParentFolder() {
  if (folder.value.parent) {
    router.push(`/folder/${folder.value.parent.id}`);
  }
}

watch(
  () => props.selectedFolderId, 
  () => { 
  folderId.value = props.selectedFolderId
  getFolder()
  },{deep: true}
)
</script>

<style lang='scss' scoped>
  .folder-main{}

  .folder {
  display: flex;
  gap: 20px;
  margin-top: 20px;
  &__main {
    width: 100%;
  }
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
</style>