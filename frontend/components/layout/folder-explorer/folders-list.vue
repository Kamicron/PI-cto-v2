<template>
  <div class="folders-list">
    <div class="folders-list__content">
      <folder-explorer :folders="folders" :depth="2"/>
    </div>
  </div>
</template>
  
<script setup lang="ts">
defineProps<{ folders: any[] }>()
</script>
  
<style lang='scss' scoped>
.folders-list {
  position: relative;
  width: 320px;
  height: calc(100vh - 75px);
  box-shadow: 0 0 3px #000 ;
  padding: 10px;
  &__content {
    width: 100%;
    overflow-x: scroll;
  }
}
</style>