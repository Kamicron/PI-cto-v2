<template>
  <div>
    <pc-header />
    <div class="layout">
      <NuxtPage />
    </div>
  </div>
  <pi-footer />
</template>

<script setup lang="ts">
import { useAuthStore } from '../frontend/stores/auth';
import { onMounted } from 'vue';
import { EToast , ETextOverflow} from 'vue3-modern-toast'

const { $toast } = useNuxtApp()

const authStore = useAuthStore();
onMounted(() => {
  authStore.fetchAuthStatus();
});

// Configuration globale
$toast.configure({
  position: {
    top: 90,
    right: 20
    // Vous pouvez aussi utiliser bottom et left
  },
  styles: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '16px',
    borderRadius: '10px 0 10px 0',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    width: '300px',
    types: {
      [EToast.SUCCESS]: {
        backgroundColor: '#48BB78',
        color: '#F4F6F8',
        borderColor: '#48BB78'
      },
      [EToast.ERROR]: {
        backgroundColor: '#F56565',
        color: '#F4F6F8',
        borderColor: '#F56565'
      },
      [EToast.WARNING]: {
        backgroundColor: '#ffc107',
        color: '#2c3b4c',
        borderColor: '#ffc107'
      },
      [EToast.INFO]: {
        backgroundColor: '#17a2b8',
        color: '#F4F6F8',
        borderColor: '#17a2b8'
      }
    }
  }
})
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

/* Toast Styles Override */
.toast-container {
  z-index: 9999 !important;
}
</style>