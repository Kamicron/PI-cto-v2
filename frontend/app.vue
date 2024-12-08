
<template>
  <pc-header />
  <div class="layout">
    <NuxtPage />
  </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from '../frontend/stores/auth';
import { onMounted } from 'vue';

const authStore = useAuthStore();
onMounted(() => {
  authStore.fetchAuthStatus(); // Synchronise l'état d'authentification
});
</script>

<style lang="scss">
@import "modern-css-reset";
@import url('https://fonts.googleapis.com/css2?family=Molle&family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap');

.layout {
  max-width: 1200px;
  margin: auto;
  font-family: 'Montserrat', sans-serif;
}
</style>