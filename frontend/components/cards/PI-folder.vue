<template>
  <div class='card-folder'>
    <NuxtLink class='card-folder__link' :to="`/folder/${folder.id}`">
      <font-awesome-icon class="card-folder__link--icon" :icon="['fas', 'folder-closed']" />
    </NuxtLink>
    <p class="card-folder__link--label">{{ folder.name }}</p>
  </div>
</template>

<script setup lang='ts'>
// ----- Import -----

import type { PropType } from "vue";
import { onMounted } from "vue";

// ------------------

// ------ Type ------
interface ILightFolder {
  id: string;
  createdAt: Date;
  name: string;
}


interface IFolder {
  id: string;
  name: string;
  createdAt: Date;
  children: ILightFolder[];
  parent: ILightFolder | null;
}
// ------------------

// ----- Define -----
const props = defineProps({
  folder: { type: Object as PropType<IFolder>, default: {} }
})

// ------------------

// ------ Const -----

// ------------------

// ---- Reactive ----

// ------------------

// ---- Computed ----

// ------------------

// ------ Hooks -----
onMounted(() => {
  console.log('props', props);

})
// ------------------

// --- Async Func ---

// ------------------

// ---- Function ----

// ------------------


// ------ Watch -----

// ------------------

</script>

<style lang='scss' scoped>
.card-folder {
  color: #de9c00;

  display: flex;
  flex-direction: column;
  gap: 5px;
  justify-content: center;
  align-items: center;


  &__link {
    color: #de9c00;
    text-decoration: none;

    :hover {
      color: #fac941;
    }


    &--icon {
      font-size: 40px;
    }

    &--label {
      margin: 0;
      color: black;
    }
  }

}
</style>