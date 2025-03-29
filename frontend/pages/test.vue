<template>
    <div class="card flex justify-content-center gap-3">
        <Button class="button" type="button" label="Search" icon="pi pi-search" :loading="loading" @click="load" />
        <Button label="Normal" icon="pi pi-check" />
        <Button label="Error" icon="pi pi-times" severity="error" />
        <Button label="Outline" icon="pi pi-user" class="p-button-outline" />
    </div>
</template>

<script setup>
import { ref } from 'vue';

const loading = ref(false);

const load = () => {
    loading.value = true;
    setTimeout(() => {
        loading.value = false;
    }, 2000);
};
</script>

<style lang="scss" scoped>
.button {
 margin: 10px; 
}
.card {
    padding: 2rem;
}
</style>