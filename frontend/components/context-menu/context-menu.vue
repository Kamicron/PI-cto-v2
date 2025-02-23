<template>
  <div v-if="show" class="context-menu" :style="{ top: `${y}px`, left: `${x}px` }">
    <div class="context-menu__item" v-for="item in items" :key="item.label" @click="handleItemClick(item)">
      <font-awesome-icon :icon="item.icon" />
      <span>{{ item.label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';

// ----- Define Props -----
defineProps({
  show: {
    type: Boolean,
    required: true
  },
  x: {
    type: Number,
    required: true
  },
  y: {
    type: Number,
    required: true
  },
  items: {
    type: Array as PropType<Array<{
      label: string;
      icon: string[];
      action: string;
    }>>,
    required: true
  }
});

const emit = defineEmits(['select']);

// ----- Functions -----
function handleItemClick(item: { label: string; action: string }) {
  emit('select', item.action);
}
</script>

<style lang="scss" scoped>
.context-menu {
  position: fixed;
  background: $white-color;
  border: 1px solid $gray-light-color;
  border-radius: 4px;
  padding: 0.5rem 0;
  min-width: 160px;
  box-shadow: $box-shadow;
  z-index: 1000;

  &__item {
    padding: 0.5rem 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    color: $dark-color;
    transition: all 0.2s ease;

    svg {
      width: 16px;
      color: $gray-medium-color;
    }

    &:hover {
      background: darken($white-color, 5%);
      color: $primary-color;

      svg {
        color: $primary-color;
      }
    }
  }
}
</style>
