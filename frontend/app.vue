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
@import url('https://fonts.googleapis.com/css2?family=Molle&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap');
body {
  background-color: $white-color;
  color: $dark-color;
  font-family: $font-primary;
}

.layout {
  max-width: $container-width;
  margin: auto;
  font-family: 'Montserrat', sans-serif;
  background-color: $white-color;
  margin-top: 70px;
}
</style>