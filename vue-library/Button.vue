<template>
  <button
    :type="type"
    class="vl-button"
    :class="[
      normalizedButtonClass,
      {
        'vl-button--icon-only': isIconOnly,
        'vl-button--disabled': disabled,
      },
    ]"
    :disabled="disabled"
    @click="handleClick"
  >
    <img
      v-if="icon && iconPosition === 'left'"
      :src="icon"
      alt=""
      class="vl-button__icon"
    />

    <span v-if="text" class="vl-button__text">
      {{ text }}
    </span>

    <slot />

    <img
      v-if="icon && iconPosition === 'right'"
      :src="icon"
      alt=""
      class="vl-button__icon"
    />
  </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  text: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: '',
  },
  iconPosition: {
    type: String,
    default: 'left',
  },
  buttonClass: {
    type: String,
    default: 'button__primary',
  },
  type: {
    type: String,
    default: 'button',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['click']);

const normalizedButtonClass = computed(() => props.buttonClass || 'button__primary');
const isIconOnly = computed(() => !!props.icon && !props.text);

function handleClick(event) {
  if (props.disabled) return;
  emit('click', event);
}
</script>

<style scoped>
.vl-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;
  border-radius: 999px;
  cursor: pointer;
  font: inherit;
  transition: 0.2s ease;
  min-height: 2.5rem;
  padding: 0.7rem 1rem;
}

.vl-button:disabled,
.vl-button--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.vl-button__icon {
  width: 1rem;
  height: 1rem;
  object-fit: contain;
  flex-shrink: 0;
}

.vl-button__text {
  white-space: nowrap;
}

.vl-button--icon-only {
  padding: 0.55rem;
  min-width: 2.5rem;
}

.button__primary {
  background: #1f2430;
  color: white;
}

.button__primary:hover:not(:disabled) {
  background: #2c3342;
}

.button__white {
  background: white;
  color: #1f2430;
  border: 1px solid #d8dee8;
}

.button__white:hover:not(:disabled) {
  background: #f8fafc;
}

.button__light-blue {
  background: #43abff;
  color: white;
}

.button__light-blue:hover:not(:disabled) {
  filter: brightness(0.96);
}

.button__ghost {
  background: transparent;
  color: inherit;
  border: none;
  box-shadow: none;
}

</style>