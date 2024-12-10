<template>
  <ul class='folder-explorer-list'>
    <li v-for="(folder, index) in folders" :key="index" @click="openFolder = openFolder === index ? null : index">
      <div class='folder-explorer-list__folder-element'> 
        <font-awesome-icon :icon="['fad', 'folder-closed']" class='folder-explorer-list__folder-element--logo'/>{{ folder.name }}
      </div>
      <folder-explorer-list v-if="openFolder === index" :folders="folder.children" style="margin-left: 10px;"/>
    </li>
  </ul>
</template>

<script setup lang='ts'>
import { ref } from 'vue';

defineProps({folders: {type: Object, default: () => []}})

const openFolder = ref<string | null>(null)

</script>

<style lang='scss' scoped>
    .folder-explorer-list{
      &__folder-element{
        display: flex;
        color: black;
        align-items: center;
        gap: 5px;
        cursor: pointer;

        &--logo {
          color: #de9c00;
        }
      }
    }
</style>