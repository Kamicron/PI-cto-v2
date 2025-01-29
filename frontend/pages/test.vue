<template>
  <div class='test'>
    <!-- <img class='test__background' src="http://api.pi-cto.top/uploads/16d20c54-45bf-4dba-bbc1-9e377f7c224e/1733761480896-transparent.jpg" alt="test">
    <img class='test__image' src="http://api.pi-cto.top/uploads/16d20c54-45bf-4dba-bbc1-9e377f7c224e/1733756308445-Sans%20titre.png" alt=""> -->
  </div>
</template>

<script setup lang='ts'>
import { useNuxtApp } from 'nuxt/app';
import { onMounted } from 'vue';

// ----- Import -----

// ------------------

// ------ Type ------

// ------------------

// ----- Define -----

// ------------------

// ------ Const -----
const { $api } = useNuxtApp();
// ------------------

// ---- Reactive ----

// ------------------

// ---- Computed ----

// ------------------

// ------ Hooks -----
onMounted(() => getFolders())
// ------------------

// --- Async Func ---
async function getFolders() {
  const { data } = await $api.get(`/folders/`)
  console.log({ data });
}
// ------------------

// ---- Function ----

// ------------------


// ------ Watch -----

// ------------------

</script>

<style lang='scss' scoped>
.test{
  position: relative;

  &__background {
    position: absolute;
  }

  &__image {
    position: absolute;
  }
}
</style>