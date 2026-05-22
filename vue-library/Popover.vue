<template>
  <div class="vl-popover" ref="rootRef">
    <div class="vl-popover__anchor" @click="toggle">
      <slot name="anchor" />
    </div>

    <Transition name="vl-popover-fade">
      <div
        v-if="isOpen"
        class="vl-popover__content"
        :class="alignmentClass"
      >
        <slot name="content" />
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

const props = defineProps({
  align: {
    type: String,
    default: 'bottom',
  },
});

const emit = defineEmits(['popover-toggle']);

const isOpen = ref(false);
const rootRef = ref(null);

const alignmentClass = computed(() => {
  return `vl-popover__content--${props.align}`;
});

function open() {
  isOpen.value = true;
  emit('popover-toggle', true);
}

function close() {
  isOpen.value = false;
  emit('popover-toggle', false);
}

function toggle() {
  if (isOpen.value) close();
  else open();
}

function onDocumentClick(event) {
  const root = rootRef.value;
  if (!root) return;
  if (!root.contains(event.target)) {
    close();
  }
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick);
});
</script>

<style scoped>
.vl-popover {
  position: relative;
  display: inline-block;
}

.vl-popover__anchor {
  display: inline-flex;
  cursor: pointer;
}

.vl-popover__content {
  position: absolute;
  z-index: 1000;
  min-width: 12rem;
  max-width: 18rem;
  background: white;
  border: 1px solid #e5eaf1;
  border-radius: 0.9rem;
  box-shadow: 0 14px 30px rgba(22, 28, 45, 0.12);
  padding: 0.75rem;
}

.vl-popover__content--bottom {
  top: calc(100% + 0.5rem);
  left: 0;
}

.vl-popover__content--top {
  bottom: calc(100% + 0.5rem);
  left: 0;
}

.vl-popover__content--left {
  right: calc(100% + 0.5rem);
  top: 0;
}

.vl-popover__content--right {
  left: calc(100% + 0.5rem);
  top: 0;
}

.vl-popover-fade-enter-active,
.vl-popover-fade-leave-active {
  transition: opacity 0.16s ease, transform 0.16s ease;
}

.vl-popover-fade-enter-from,
.vl-popover-fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>