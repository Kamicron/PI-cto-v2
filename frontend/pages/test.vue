<template>
  <div class="wrapper">
    <folders-list :folders="folders"/>
  </div>
</template>

<script setup lang="ts">
const { $api } = useNuxtApp()

const folders = ref<any[]>([])
const openFolders = ref(new Set<number>())

onMounted(() => getAllFolders())

async function getAllFolders() {
  const { data, error } = await $api.get('/folders')
  if (!data || error) return

  folders.value = data.map(folder => ({
    ...folder,
    children: folder.children || [] 
  }))
}
</script>

<style lang='scss' scoped></style>