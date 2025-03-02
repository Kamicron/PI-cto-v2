<template>
  <div class="folders-list">
    <folder-explorer :folders="folders"/>
  </div>
</template>
  
<script setup lang="ts">
defineProps<{ folders: any[] }>()
</script>
  
<style lang='scss' scoped>
.folders-list {
  width: 320px;
  height: calc(100vh - 75px);
  overflow: hidden;
  border: solid;
}
</style>