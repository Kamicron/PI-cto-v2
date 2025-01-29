<template>
  <button @click="showToastSuccess">Show Toast Success</button>
  <button @click="showToastError">Show Toast Error</button>
  <button @click="showToastWarning">Show Toast Warning</button>
  <button @click="showToastInfo">Show Toast Info</button>

</template>

<script setup lang="ts">
import { EToast } from 'vue3-modern-toast'

const { $toast } = useNuxtApp()

function showToastSuccess() {
  $toast.show({
    message: 'Success message',
    type: EToast.SUCCESS,
    duration: 3000,
    dismissible: true,
    icon: '✨'
  })
}

function showToastError() {
  $toast.show({
    message: 'Error message',
    type: EToast.ERROR,
    duration: 3000,
    dismissible: true,
    icon: '⛔'
  })
}

function showToastWarning() {
  $toast.show({
    message: 'Warning message',
    type: EToast.WARNING,
    duration: 3000,
    dismissible: true,
    icon: '⚠'
  })
}

function showToastInfo() {
  $toast.show({
    message: 'Info message',
    type: EToast.INFO,
    duration: 3000,
    dismissible: true,
    icon: ''
  })
}


</script>

<style lang='scss' scoped>
button {
  padding: 10px 20px;
  background-color: #4299E1;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #2B6CB0;
  }
}
</style>