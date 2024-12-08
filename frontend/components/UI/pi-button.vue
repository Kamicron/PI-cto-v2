<template>
  <div class='pi-button' tabindex="0">
    <button class="button" >
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
  icon: { type: Array, default: () => [] }
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
  border-radius: 10px 0 10px 0;
  background-color: $primary-color;

  .button {
    all: unset;
    display: flex;
    align-items: center;
    justify-content: center;

    color: #3f556d;

    &__icon {
      background-color: rgba(0, 0, 0, 0.30);
      width: 30px;
      height: 30px;
      padding: 10px;
      border-radius: 10px 0 10px 0;
      color: $white-color;


    }

    &__label {
      padding: 10px;
      font-family: $font-button;
      font-weight: 500;
      font-size: 1rem;
      line-height: 1.5;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: $white-color;

    }
  }
}
</style>