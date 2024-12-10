<template>
  <ul class='folder-explorer-list'>
    <li v-for="(folder, index) in folders" :key="index" @click="openFolder(folder.id, index)">
      <div class='folder-explorer-list__folder-element' :class="{'--is-active': toggleFolder === index}">
        <font-awesome-icon :icon="[`${toggleFolder === index ? 'far': 'fad'}`, `folder-${toggleFolder === index ? 'open' : 'closed'}`]" class='folder-explorer-list__folder-element--logo'/>{{ folder.name }}
      </div>
      <folder-explorer-list v-if="toggleFolder === index" :folders="folder.children" style="margin-left: 10px;"/>
    </li>
  </ul>
</template>

<script setup lang='ts'>
import { ref } from 'vue';

const emit = defineEmits(['select-folder'])
defineProps({folders: {type: Object, default: () => []}})

const toggleFolder = ref<string | null>(null)

function openFolder(folderId: string, index: string) {
  toggleFolder.value = toggleFolder.value === index ? null : index
  emit('select-folder', folderId)
}
</script>

<style lang='scss' scoped>
    .folder-explorer-list{
      &__folder-element{
        display: flex;
        color: black;
        align-items: center;
        gap: 5px;
        cursor: pointer;
        transition: .2s;
        font-weight: 300;
        text-decoration: underline transparent;
        
        &--logo {
          color: #de9c00;
        }
        
        &.--is-active {
          text-decoration: underline solid;
        }
        
        &:hover {
          transform: translateX(2px) translateY(-1px);
          text-decoration: underline solid;
        }
      }
    }
</style>