<template>
  <ul class="folder-explorer">
    <li v-for="folder in folders" :key="`folder-${folder.id}`" class="folder-explorer__folder-element">
      <div @click="toggleFolder(folder.id)" class="folder-explorer__folder-element__link">
        <font-awesome-icon 
          class="folder-icon"
          :icon="openFolders.has(folder.id) ? ['fad', 'folder-open'] : ['fad', 'folder-closed']"
        />
        <p class="folder-name">
          {{ folder.name }}
        </p>
      </div>

      <folder-explorer 
        v-if="openFolders.has(folder.id) && folder.children && folder.children.length > 0"
        :folders="folder.children"
      />
    </li>
  </ul>
</template>

<script setup lang="ts">
const props = defineProps<{ folders: any[] }>()
const openFolders = ref(new Set<number>())

function toggleFolder(folderId: number) {
  if (openFolders.value.has(folderId)) {
    openFolders.value.delete(folderId)
  } else {
    openFolders.value.add(folderId)
  }
}
</script>

<style lang='scss' scoped>
.folder-explorer {
  list-style: none;
  padding: 0 0 0 10px;
  &__folder-element {
    &__link {
      color: black;
      display: flex;
      align-items: center;
      gap: 5px;
      cursor: pointer;
      text-decoration: underline 1px transparent;
      transition: 0.3s;
      .folder-icon {
        color: $folder;
        width: 20px;
      }

      .folder-name {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }

      &:hover {
        text-decoration: underline 1px #000;
      }
    }
  }
}
</style>