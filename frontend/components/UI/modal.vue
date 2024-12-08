
<template>
  <dialog>
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="isOpen"
          ref="modalMask"
          class="modal-mask"
          :style="`--max-width: ${maxWidth}`"
          @mousedown="closeModalOutside"
        >
          <div :class="['modal-wrapper', confirmationStyle ? 'confirmationStyle' : '']" @mousedown.stop>
            <div class="modal-container">
              <h5 v-if="refTitle">{{ refTitle }}</h5>
              <button class="modal-close-button" @click="closeModal">
                <font-awesome-icon :icon="['far', 'circle-xmark']" />
              </button>
              <div class="modal-content vmc-custom-scroll">
                <slot></slot>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </dialog>
</template>

<script setup lang="ts">
import { watch, ref } from "vue"


const props = defineProps({
  confirmationStyle: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  isOpen: {
    type: Boolean,
    default: false
  },
  maxWidth: {
    type: String,
    default: '90%'
  },
  id: {
    type: String,
    default: null
  }
})

const refTitle = ref<string>(props.title)

const modalMask = ref<HTMLElement | null>(null)
const emitEvent = defineEmits(['close'])

watch(
  () => props.title,
  () => (refTitle.value = props.title || '')
)

const closeModal = () => {
  emitEvent('close')
}

const closeModalOutside = (event: MouseEvent) => {
  const container = modalMask.value?.querySelector('.modal-container')
  if (container && !container.contains(event.target as Node)) {
    closeModal()
  }
}
</script>

<style lang="scss" scoped>
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.65);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  z-index: 100;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  background-color: #fff;
  padding: 10px;
  max-width: var(--max-width);
  width: 90%;
  position: relative;
  border: 1px solid #dcdcdc;
  box-shadow: 10px 10px 8px rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  transition: all 0.3s ease;
}

.confirmationStyle {
  width: auto;
}
.modal-close-button {
  position: absolute;
  right: 0;
  top: 0;
  background: none;
  border: none;
  font-size: 20px;
  margin: 5px 6px;
  cursor: pointer;
}

.modal-content {
  max-height: 70vh;
  overflow-y: auto;
  margin: 20px 0;
  padding: 0 5px;
}
.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-wrapper,
.modal-leave-to .modal-wrapper,
.modal-enter-from .vmc-input,
.modal-leave-to .vmc-input {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

h5 {
  font-style: normal;
  font-weight: 800;
  font-size: 14px;
  line-height: 14px;
  text-transform: none;
  margin-bottom: 30px;
  padding-right: 25px;
}

@media screen and (min-width: 740px) {
  .modal-wrapper {
    margin-top: 20px !important;
  }
}
</style>
