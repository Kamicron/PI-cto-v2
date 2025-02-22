<template>
  <div class='card-folder' @contextmenu.prevent="showContextMenu">
    <NuxtLink class='card-folder__link' :to="`/folder/${folder.id}`">
      <font-awesome-icon class="card-folder__link--icon" :icon="['fas', 'folder-closed']" />
    </NuxtLink>
    <p class="card-folder__link--label">{{ folder.name }}</p>

    <context-menu
      :show="isContextMenuVisible"
      :x="contextMenuX"
      :y="contextMenuY"
      :items="contextMenuItems"
      @select="handleContextMenuAction"
    />

    <modal :isOpen="isRenameModalOpen" @close="closeRenameModal" title="Renommer le dossier">
      <div class="rename-modal">
        <div class="rename-modal__input">
          <label>Nouveau nom</label>
          <input v-model="newFolderName" type="text" @keyup.enter="handleRename">
        </div>
        <div class="rename-modal__actions">
          <pi-button tiny bg-color="#28a745" @click="handleRename" :icon="['far', 'floppy-disk']" label="Sauvegarder" />
          <pi-button tiny bg-color="#dc3545" @click="closeRenameModal" :icon="['fas', 'xmark']" label="Annuler" />
        </div>
      </div>
    </modal>
  </div>
</template>

<script setup lang='ts'>
// ----- Import -----
import type { PropType } from "vue";
import { ref } from "vue";
import { useNuxtApp } from "#app";
import { EToast } from "vue3-modern-toast";
import { useAxiosError } from '../../composables/useAxiosError';

// ------------------

// ------ Type ------
interface ILightFolder {
  id: string;
  createdAt: Date;
  name: string;
}

interface IFolder {
  id: string;
  name: string;
  createdAt: Date;
  children: ILightFolder[];
  parent: ILightFolder | null;
}
// ------------------

// ----- Define -----
const props = defineProps({
  folder: { type: Object as PropType<IFolder>, required: true }
})

const emit = defineEmits(['deleted', 'renamed']);

// ------------------

// ------ Const -----
const { $api } = useNuxtApp();
const { $toast } = useNuxtApp();
const { getErrorMessage } = useAxiosError();

const contextMenuItems = [
  { label: 'Renommer', icon: ['fas', 'pen'], action: 'rename' },
  { label: 'Supprimer', icon: ['fas', 'trash-can'], action: 'delete' }
];
// ------------------

// ---- Reactive ----
const isContextMenuVisible = ref(false);
const contextMenuX = ref(0);
const contextMenuY = ref(0);
const isRenameModalOpen = ref(false);
const newFolderName = ref('');
// ------------------

// ---- Function ----
function showContextMenu(event: MouseEvent) {
  event.preventDefault();
  contextMenuX.value = event.clientX;
  contextMenuY.value = event.clientY;
  isContextMenuVisible.value = true;

  // Ferme le menu au clic en dehors
  const closeMenu = () => {
    isContextMenuVisible.value = false;
    document.removeEventListener('click', closeMenu);
  };
  document.addEventListener('click', closeMenu);
}

function handleContextMenuAction(action: string) {
  isContextMenuVisible.value = false;
  
  switch (action) {
    case 'rename':
      openRenameModal();
      break;
    case 'delete':
      deleteFolder();
      break;
  }
}

function openRenameModal() {
  newFolderName.value = props.folder.name;
  isRenameModalOpen.value = true;
}

function closeRenameModal() {
  isRenameModalOpen.value = false;
  newFolderName.value = '';
}

async function handleRename() {
  if (!newFolderName.value || newFolderName.value.trim().length < 3) {
    $toast.show({
      message: 'Le nom du dossier doit contenir au moins 3 caractères',
      type: EToast.WARNING,
      duration: 3000,
      dismissible: true,
      icon: '⚠️'
    });
    return;
  }

  try {
    const { data } = await $api.patch(`/folders/${props.folder.id}/name`, {
      name: newFolderName.value.trim()
    });

    emit('renamed', data);
    closeRenameModal();

    $toast.show({
      message: 'Dossier renommé avec succès',
      type: EToast.SUCCESS,
      duration: 3000,
      dismissible: true,
      icon: '✨'
    });
  } catch (error) {
    $toast.show({
      message: getErrorMessage(error),
      type: EToast.ERROR,
      duration: 3000,
      dismissible: true,
      icon: '⛔'
    });
  }
}

async function deleteFolder() {
  try {
    await $api.delete(`/folders/${props.folder.id}`);
    emit('deleted', props.folder.id);

    $toast.show({
      message: 'Dossier supprimé avec succès',
      type: EToast.SUCCESS,
      duration: 3000,
      dismissible: true,
      icon: '✨'
    });
  } catch (error) {
    $toast.show({
      message: getErrorMessage(error),
      type: EToast.ERROR,
      duration: 3000,
      dismissible: true,
      icon: '⛔'
    });
  }
}
// ------------------
</script>

<style lang='scss' scoped>
.card-folder {
  color: #de9c00;
  display: flex;
  flex-direction: column;
  gap: 5px;
  justify-content: center;
  align-items: center;
  position: relative;

  &__link {
    color: #de9c00;
    text-decoration: none;

    &:hover {
      color: #fac941;
    }

    &--icon {
      font-size: 40px;
    }

    &--label {
      margin: 0;
      text-align: center;
      max-width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}

.rename-modal {
  padding: 1rem;

  &__input {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1.5rem;

    label {
      color: $primary-color;
      font-weight: 500;
    }

    input {
      padding: 0.5rem;
      border: 1px solid $gray-light-color;
      border-radius: 4px;
      font-size: 1rem;

      &:focus {
        outline: none;
        border-color: $primary-color;
      }
    }
  }

  &__actions {
    display: flex;
    justify-content: center;
    gap: 1rem;

    :deep(.pi-button) {
      min-width: 120px;
    }
  }
}
</style>