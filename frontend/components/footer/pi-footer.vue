<template>
  <div class='footer'>
    <p class="footer__title">Espace disponible </p>
    <donut-chart class="footer__chart" v-if="diskUsage" :configChart="diskUsage" />
    <p class="footer__information">
      <span class="footer__information--value">{{ freeSpace }}</span>Go / 
      <span class="footer__information--value">{{ totalSpace }}</span>Go
    </p>
  </div>
</template>

<script setup lang='ts'>
// ----- Import -----
import { ref, onMounted, computed } from 'vue';
import { useNuxtApp } from "#app";
import { type IDonutChart } from '../../assets/ts/interfaces/chart'

// ------------------

// ------ Type ------

// ------------------

// ----- Define -----

// ------------------

// ------ Const -----
const { $api } = useNuxtApp();

// ------------------

// ---- Reactive ----
const diskUsage = ref<IDonutChart>({
  value: 0,
  maxValue: 10000,
  size: 100,
  strokeWidth: 8,
  color: '#84e69b',
  backgroundColor: "#ee727e"

})
const totalSpace = ref<number>(0);
const freeSpace = ref<number>(0);
// ------------------

// ---- Computed ----
const usedPercentage = computed(() =>
  totalSpace.value
    ? ((totalSpace.value - freeSpace.value) / totalSpace.value) * 100
    : 0
);
// ------------------

// ------ Hooks -----
onMounted(fetchDiskUsage);
// ------------------

// --- Async Func ---
async function fetchDiskUsage() {
  const { data } = await $api.get(`/disk/usage`)
  console.log('data', data);


  totalSpace.value = parseFloat((Number(data.total) / (1024 ** 3)).toFixed(2)); // bit to Go
freeSpace.value = parseFloat((Number(data.free) / (1024 ** 3)).toFixed(2)); // bit to Go


  diskUsage.value = {
    value: freeSpace.value,
    maxValue: totalSpace.value,
    size: 100,
    strokeWidth: 8,
    color: '#84e69b',
    backgroundColor: "#ee727e"
  }
}
// ------------------

// ---- Function ----

// ------------------


// ------ Watch -----

// ------------------

</script>

<style lang='scss' scoped>
.footer {
  position: fixed;
  bottom: 10px;
  right: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: center;
  background-color: white;
  border-radius: $border-radius;
  box-shadow: $box-shadow;
  z-index: 2;

  &__information {
    &--value {
      color: $dynamic-color
    }
  }
}
</style>