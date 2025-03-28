<template>
  <div class="upload-photo">
    <div class="upload-photo__dropzone" @dragover.prevent="isDragging = true" @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop" :class="{ 'upload-photo__dropzone--active': isDragging }">
      <p>Déposez vos fichiers ici ou</p>
      <Button @click="triggerFilePicker" type="button" icon="pi pi-upload" label="Téléverser" />
      <input ref="fileInput" type="file" class="upload-photo__file-input" multiple @change="handleFileSelect" />
    </div>

    <div v-if="files.length" class="upload-photo__preview">
      <h3>Aperçu des fichiers</h3>
      <ul>
        <li v-for="(file, index) in preview" :key="index" class="upload-photo__preview-item">
          <img v-if="file.type.startsWith('image/')" :src="file.preview" :alt="file.name"
            class="upload-photo__preview-img" />
          <p>{{ file.name }}</p>
          <pi-button @click="removeFile(index)" label="Supprimer" :bg-color="'#dc3545'" :icon="['fas', 'trash-can']"/>
          <Button @click="removeFile(index)" type="button" icon="pi pi-trash" label="Supprimer" />
        </li>
      </ul>
    </div>


    <!-- <button class="upload-photo__submit" :disabled="isUploading || !files.length" @click="uploadFiles">
      {{ isUploading ? "Téléversement en cours..." : "Téléverser" }}
    </button> -->

    <pi-button class="upload-photo__submit" :label="isUploading ? 'Téléversement en cours...' : 'Téléverser'"
      :icon="['fas', 'upload']" :bgColor="isUploading || !files.length ? '#a0a0a0' : '#3f556d'" @click="uploadFiles" />

    <div class="uploader">
        <div class="actions">
            <Button 
                icon="pi pi-upload" 
                label="Télécharger" 
                @click="handleUpload"
            />
            <Button 
                icon="pi pi-times" 
                label="Annuler" 
                severity="error"
                @click="handleCancel"
            />
        </div>
    </div>

    <p v-if="errorMessage" class="upload-photo__error">{{ errorMessage }}</p>
  </div>
</template>

<script setup lang="ts">
// ----- Import -----
import { ref } from "vue";
import { useNuxtApp } from "#app";
import { EToast } from "vue3-modern-toast";
import { useAxiosError } from '../../composables/useAxiosError';
// ------------------

// ------ Type ------

// ------------------

// ----- Define -----
const emit = defineEmits(['upload'])
const props = defineProps({
  folderId: { type: String, default: '' }
})

// ------------------

// ------ Const -----
const { $api } = useNuxtApp();
const { $toast } = useNuxtApp()
const { getErrorMessage } = useAxiosError();
// ------------------

// ---- Reactive ----
const files = ref<File[]>([])
const preview = ref<File[]>([])
const isDragging = ref(false)
const isUploading = ref(false)
const errorMessage = ref("")
const fileInput = ref<HTMLInputElement | null>(null)

// ------------------

// ---- Computed ----

// ------------------

// ------ Hooks -----

// ------------------

// --- Async Func ---
async function uploadFiles() {
  if (!files.value.length) {
    errorMessage.value = "Aucun fichier sélectionné.";
    return;
  }

  isUploading.value = true;
  errorMessage.value = "";

  const formData = new FormData();
  const numberOfFiles = files.value.length;
  files.value.forEach((file) => formData.append("files", file));

  try {
    await $api.post(`/images/${props.folderId}/upload`, formData);
    emit("upload");
    files.value = [];
    preview.value = [];

    $toast.show({
      message: numberOfFiles > 1 ? `${numberOfFiles} images téléversées avec succès` : 'Image téléversée avec succès',
      type: EToast.SUCCESS,
      duration: 3000,
    });
  } catch (error) {
    $toast.show({
      message: getErrorMessage(error),
      type: EToast.ERROR,
      duration: 3000,
    });
  } finally {
    isUploading.value = false;
  }
}
// ------------------

// ---- Function ----
function triggerFilePicker() {
  fileInput.value?.click();
}

function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement;
  const preview = event.target as HTMLInputElement;
  if (!input.files && !preview.files) return;

  files.value.push(...Array.from(input.files));
  Array.from(preview.files).forEach(addFileWithPreview);
}

function handleDrop(event: DragEvent) {
  event.preventDefault();
  isDragging.value = false;

  if (event.dataTransfer?.files) {
    files.value.push(...Array.from(event.dataTransfer.files));
  }
}

function addFileWithPreview(file: File) {
  const reader = new FileReader();
  reader.onload = (e) => {
    preview.value.push({
      file,
      preview: e.target?.result as string,
      name: file.name,
      type: file.type,
    });
  };
  reader.readAsDataURL(file);
}

function removeFile(index: number) {
  files.value.splice(index, 1);
  preview.value.splice(index, 1);
}

const handleUpload = () => {
    // Logique de téléchargement
}

const handleCancel = () => {
    // Logique d'annulation
}
// ------------------


// ------ Watch -----

// ------------------
</script>


<style lang="scss" scoped>
.upload-photo {
  border-radius: $border-radius;

  border: 1px solid $gray-medium-color;
  padding: 20px;

  &__dropzone {
    border: 2px dashed $gray-light-color;
    border-radius: $border-radius;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    text-align: center;
    margin-bottom: 16px;
    cursor: pointer;
    transition: all 0.3s;

    &--active {
      border-color: #007bff;
      background-color: #f0f8ff;
    }
  }

  &__file-input {
    display: none;
  }

  &__preview {
    margin: 16px 0;

    &-item {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;

    }

    &-img {
      width: 50px;
      height: 50px;
      object-fit: cover;
      border-radius: 4px;
    }
  }

  &__submit {
    border: none;
    border-radius: $border-radius;
    cursor: pointer;
    transition: background-color 0.3s;

    &:disabled {
      cursor: not-allowed;
    }
  }

  &__error {
    color: red;
    margin-top: 10px;
  }
}

.uploader {
    .actions {
        display: flex;
        gap: 1rem;
        margin: 1rem 0;
    }
}
</style>
