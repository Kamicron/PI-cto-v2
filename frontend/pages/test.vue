
<template>
  <div class="card flex flex-wrap justify-center items-end gap-4 test">
      <!-- <FloatLabel>
          <AutoComplete v-model="value1" inputId="over_label" :suggestions="items" @complete="search" />
          <label for="over_label">Over Label</label>
      </FloatLabel>

      <FloatLabel variant="in">
          <AutoComplete v-model="value2" inputId="in_label" :suggestions="items" @complete="search" variant="filled" />
          <label for="in_label">In Label</label>
      </FloatLabel> -->

      <FloatLabel variant="on">
          <AutoComplete v-model="value3" inputId="on_label" :suggestions="items" @complete="search" />
          <label for="on_label">On Label</label>
      </FloatLabel>
  </div>
</template>

<script setup>
import { ref } from "vue";

const value1 = ref('');
const value2 = ref('');
const value3 = ref('');
const items = ref([]);

const search = (event) => {
  items.value = [...Array(10).keys()].map((item) => event.query + '-' + item);
}
</script>

<style lang="scss" scoped>
.test {
  margin: 200px;  
}
</style>

