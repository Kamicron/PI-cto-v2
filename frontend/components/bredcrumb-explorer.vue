<template>
    <div class="bredcrumb-explorer">
      <ul>
        <li v-for="(folder, index) in folders" :key="index">
          <font-awesome-icon :icon="['fad', 'folder-closed']" />{{ folder.name }}
        </li>
      </ul>
    </div>
</template>

<script setup lang='ts'>
import { useNuxtApp } from "#app";
import { onMounted, ref } from "vue";

const { $api } = useNuxtApp();

const folders = ref()

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
</script>

<style lang='scss' scoped>
    .bredcrumb-explorer{
      width: 275px;
      height: calc(100dvh - 100px);
      padding: 10px;
      border: solid 1px;
      border-radius: $border-radius;
    }
</style>