<template>
  <!-- <div v-if="!isLoggedIn">Connectez-vous</div> -->
   <div class="folder">
    <folders-explorer @select-folder="(id: string) => folderId = id"/>
    <folder-content :selected-folder-id="folderId"/>
  <!-- <div v-if="folder">

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
  </div>  -->
</div>
  <!-- <loader v-else /> -->
</template>


<script setup lang='ts'>
// ----- Import -----
import { ref  } from "vue";
import { useRouter } from "vue-router";
import { useNuxtApp } from "#app";
import { useAuthStore } from "@/stores/auth";
import { watch } from "vue";

const router = useRouter();
// const folderId = '495e09c7-e09d-481e-9c29-ae62e58fc25b';
const authStore = useAuthStore();

const folder = ref();
const folderId = ref();
const folderName = ref<string>('')
const photos = ref([]);
const isModifyFolderName = ref<boolean>(false)
const { $api } = useNuxtApp();
const isLoggedIn = ref(authStore.isLoggedIn); 

async function getFolder(id: string) {
  console.log(id);
  
  try {
    const { data } = await $api.get(`/folders/${id}`)
    folder.value = data || { name: '', children: [], parent: null }
    photos.value = data.photos || []
    folderName.value = data.name
    console.log('folder.value', folder.value);

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
    console.log('watch');
    
    console.log('isLoggedIn', isLoggedIn);
    if (isLoggedIn) {
      
      try {
        console.log('folderId', folderId);
        
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


.SubFolder {
  display: flex;
  gap: 20px
}

.back-folder {
  rotate: 180Deg;
}
</style>