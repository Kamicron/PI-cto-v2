<template>
  <ul class="folder-explorer">
    <li v-for="folder in folders" :key="`folder-${folder.id}`" class="folder-explorer__folder-element">
      <div class="folder-explorer__folder-element__wrapper" @click="toggleFolder(folder.id)" >
        <div class="folder-explorer__folder-element__wrapper__link" :style="{ paddingLeft: depth * 10 + 'px' }">
          <font-awesome-icon 
          class="folder-icon"
          :icon="openFolders[folder.id] ? ['fad', 'folder-open'] : ['fad', 'folder-closed']"
          />

          <input   
          v-if="isEditing[folder.id]"
          class="folder-name input" 
          type="text"
          v-model="folderName[folder.id]"
          @blur="folder.name"
          >
          <p v-else class="folder-name">
            {{ folder.name }}
          </p>
        </div>

        <div class="options">
          <div v-if="isEditing[folder.id]" class="options__icons">
            <font-awesome-icon :icon="['fas', 'circle-check']" class="icon save" @click.stop="editFolder(folder.id)" />
            <font-awesome-icon :icon="['fas', 'circle-xmark']" class="icon cancel" title="Annuler" @click.stop="cancelEdit(folder.id)"/>
          </div>
          <div v-else class="options__icons">
            <font-awesome-icon :icon="['fas', 'pen']" class="icon edit" title="Renomer" @click.stop="toggleEdit(folder.id)"/>
            <font-awesome-icon :icon="['fas', 'trash-can']" class="icon delete" title="Supprimer" @click.stop="deleteFolder(folder.id)"/>
          </div>
        </div>
      </div>

      <folder-explorer 
        v-if="openFolders[folder.id] && folder.children && folder.children.length > 0"
        :folders="folder.children"
        :depth="depth + 1"
        />
    </li>
  </ul>
</template>

<script setup lang="ts">
const { $api } = useNuxtApp()

defineProps({
  folders: { type: Array as PropType<IFolder[]>, default: () => [] },
  depth: { type: Number, default: null }
})

const openFolders = ref<Record<number, boolean>>({})
const isEditing = ref<Record<number, boolean>>({})
const folderName = ref<Record<number, string>>({})
const currentEditing = ref<number | null>(null)

function toggleFolder(folderId: number) {
  openFolders.value[folderId] = !openFolders.value[folderId]
}

function toggleEdit(folderId: number) {
  if (currentEditing.value !== null && currentEditing.value !== folderId) {
    isEditing.value[currentEditing.value] = false
  }
  
  isEditing.value[folderId] = true
  currentEditing.value = folderId
}

function cancelEdit(folderId: number) {
  isEditing.value[folderId] = false
}

async function editFolder(folderId: number) {
  const { data, error } = await $api.patch(`/folders/${folderId}/name`, { name: props.folders.find(folder => folder.id === folderId)?.name })

  if (error) {
    console.error("Erreur lors de la mise à jour du nom", error)
  } else {
    console.log('Nom mis à jour avec succès', data)
    isEditing.value[folderId] = false
  }
}

function deleteFolder(folderId: number) {
  console.log('Dossier supprimé', folderId)
  openConfirmModal.value = true
}

</script>

<style lang='scss' scoped>
.folder-explorer {
  list-style: none;
  padding: 0;
  &__folder-element {
    margin: 5px 0;
    &__wrapper{
      display: flex; 
      justify-content: space-between;
      width: 100%;
      border-radius: 5px;
      cursor: pointer;
      &__link {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 5px;
        font-family: $font-primary;
        font-weight: 400;
        color: $dark-color;
        text-decoration: underline 1px transparent;
        transition: 0.3s;
        .folder-icon {
          color: $folder;
          width: 20px;
        }
        
        .folder-name {
          width: 100%;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }

        .input {
          height: 100%;
          padding: 3px;
          border: none;
        }
      }
      
      .options {
        position: absolute;
        height: 24px;
        right: -10px;
        
        padding: 3px 10px 3px 30px;
        opacity: 0;
        background: rgb(223,223,223);
        background: -moz-linear-gradient(90deg, rgba(223,223,223,0) 0%, rgba(223,223,223,1) 37%);
        background: -webkit-linear-gradient(90deg, rgba(223,223,223,0) 0%, rgba(223,223,223,1) 37%);
        background: linear-gradient(90deg, rgba(223,223,223,0) 0%, rgba(223,223,223,1) 37%);
        filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#dfdfdf",endColorstr="#dfdfdf",GradientType=1);
        border-radius: 5px;
        transition: 0.3s;

        &__icons {
          display: flex;
          gap: 10px;
        }
        .icon {
          color: #686868;
        }
      }
      
      &:hover {
        background-color: #dfdfdf;
      }
      
      &:hover > .folder-explorer__folder-element__wrapper__link {
        text-decoration: underline 1px #000;
      }

      &:hover > .options {
        opacity: 1;
        transform: translate(-15px);
        .edit{
          transition: 0.2s;
          &:hover {
            color: $dark-color;
          }
        }
        .delete,
        .cancel {
          transition: 0.2s;
          &:hover {
            color: $danger-color;
          }
        }
        .save {
          transition: 0.2s;
          &:hover {
            color: $dynamic-color;
          }
        }
      }
    }
  }
}
</style>