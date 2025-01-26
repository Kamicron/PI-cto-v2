<template>
  <div class="folder">
    <h1>Mes Dossiers</h1>

    <p>{{ errorMessage }}</p>

    <div class="folder__subfolder">
      <h2>Dossiers racine</h2>

      <PiButton @click="openModal" :icon="['fas', 'folder-plus']" label="Ajouter un dossier" tiny />
      <div class="SubFolder" v-if="rootFolders && rootFolders.length">
        <PIFolder v-for="folder in rootFolders" :key="folder.id" :folder="folder" />
      </div>
      <p v-else>Aucun dossier.</p>
    </div>
  </div>

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
</template>

<script setup lang='ts'>
// ----- Import -----
import { ref, onMounted } from "vue";
import { useNuxtApp } from "#app";
import { EToast } from "vue3-modern-toast";
import { useAxiosError } from '../../composables/useAxiosError';

// ------ Type ------
interface ILightFolder {
  id: string;
  createdAt: Date;
  name: string;
}

// ----- Const -----
const isModalOpen = ref<boolean>(false)

// ---- Reactive ----
const rootFolders = ref<ILightFolder[]>([])
const errorMessage = ref<string>('')
const nameFolder = ref<string>('')

const { $api } = useNuxtApp();
const { getErrorMessage } = useAxiosError();
const { $toast } = useNuxtApp()

// ------ Hooks -----
onMounted(async () => {
  fetchRootFolders()
});

// ---- Methods ----
async function fetchRootFolders() {
  try {
    const { data } = await $api.get('/folders')
    rootFolders.value = data
  } catch (error: any) {
    $toast.show({
      message: getErrorMessage(error),
      type: EToast.ERROR,
      duration: 3000,
      dismissible: true,
      icon: '⛔'
    })
    errorMessage.value = error.response?.data?.message || "Une erreur est survenue lors de la récupération des dossiers."
  }
}

function openModal() {
  nameFolder.value = ''
  isModalOpen.value = true
}

async function saveFolder() {
  if (!nameFolder.value || nameFolder.value.trim().length < 3) {
    errorMessage.value = "Le nom du dossier doit contenir au moins 3 caractères."
    return
  }

  try {
    const { data } = await $api.post("/folders/create", {
      name: nameFolder.value.trim(),
      parentId: null, // null pour indiquer un dossier racine
    })

    nameFolder.value = ""
    isModalOpen.value = false
    fetchRootFolders() // Rafraîchir la liste des dossiers

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
    errorMessage.value = error.response?.data?.message || "Une erreur est survenue lors de la création du dossier."
  }
}
</script>

<style scoped>
.folder {
  padding: 20px;
}

.folder__subfolder {
  margin-top: 20px;
}

.SubFolder {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.addFolder {
  padding: 20px;
}

.addFolder__input {
  margin-bottom: 20px;
}

.addFolder__input label {
  display: block;
  margin-bottom: 5px;
}

.addFolder__input input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.addFolder__button {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}
</style>
