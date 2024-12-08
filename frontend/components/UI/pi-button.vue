<template>
  <div class="pi-button" :class="{ 'pi-button--tiny': tiny }" :style="{ backgroundColor: bgColor }" tabindex="0">
    <button class="button">
      <font-awesome-icon class='button__icon' :icon="icon" />
      <p class='button__label'>{{ label }}</p>
    </button>
  </div>
</template>


<script setup lang='ts'>
// ----- Import -----

// ------------------

// ------ Type ------

// ------------------

// ----- Define -----
defineProps({
  label: { type: String, default: 'Boutton' },
  icon: { type: Array, default: () => [] },
  bgColor: { type: String, default: '#3d556d' },
  tiny: { type: Boolean, default: false }
});

// ------------------

// ------ Const -----

// ------------------

// ---- Reactive ----

// ------------------

// ---- Computed ----

// ------------------

// ------ Hooks -----

// ------------------

// --- Async Func ---

// ------------------

// ---- Function ----

// ------------------


// ------ Watch -----

// ------------------

</script>

<style lang='scss' scoped>
.pi-button {
  cursor: pointer;
  width: fit-content;
  border-radius: $border-radius;
  transition: background-color 0.3s ease;
  box-shadow: $box-shadow;

  :hover {
    background-color: rgba(255, 255, 255, 0.35);
  }

  .button {
    all: unset;
    display: flex;
    align-items: center;
    justify-content: center;

    &__icon {
      background-color: rgba(0, 0, 0, 0.30);
      width: 25px;
      height: 25px;
      padding: 15px;
      border-radius: 10px 0 10px 0;
      color: $white-color;
    }

    &__label {
      padding: 15px;
      font-family: $font-button;
      font-weight: 500;
      font-size: 1rem;
      line-height: 1.5;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: $white-color;

    }
  }

  &--tiny {
    .button {
      &__icon {
        width: 15px;
        height: 15px;
        padding: 8px;
      }

      &__label {
        padding: 8px;
        font-size: 0.8rem;
        letter-spacing: 1px;
      }
    }
  }
}
</style>