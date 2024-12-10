<template>
  <div class="bredcrumb-explorer">
    <pi-button class="link-container__copy-buton" @click="isModalOpen = true" label="Ajouter un fichier" tiny :icon="['fas', 'plus']" style="width: 100%;" />

    <folder-explorer-list :folders="folders" @select-folder="(folderId: string)=>emit('select-folder', folderId)"/>
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
import { useNuxtApp } from "#app";
import { onMounted, ref } from "vue";

const emit = defineEmits(['select-folder'])

const { $api } = useNuxtApp();

const folders = ref()
const isModalOpen = ref<boolean>(false)
  const nameFolder = ref<string>('')
    const errorMessage = ref<string>('')

onMounted(() => fetchFolder())

async function fetchFolder() {
  try {
    const { data } = await $api.get(`/folders`)
    folders.value = data
    console.log('folder.value', data);

  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error)
  }
}

async function createFolder() {
  if (!nameFolder.value || nameFolder.value.trim().length < 3) {
    errorMessage.value = "Le nom du dossier doit contenir au moins 3 caractères.";
    return;
  }

  try {
    const { data } = await $api.post("/folders/create", {
      name: nameFolder.value.trim(),
      parentId: folderId,
    });

    nameFolder.value = ""

    fetchFolder()
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || "Une erreur est survenue.";
  }
}

function saveFolder() {
  createFolder()
  isModalOpen.value = false
}
</script>

<style lang='scss' scoped>
  .bredcrumb-explorer{
    width: 275px;
    height: calc(100dvh - 100px);
    padding: 10px;
    border: solid 1px;
    border-radius: $border-radius;
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
</style>