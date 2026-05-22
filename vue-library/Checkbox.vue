<template>
  <label class="vl-checkbox" :for="id">
    <input
      :id="id"
      class="vl-checkbox__input"
      type="checkbox"
      :checked="isChecked"
      @change="onChange"
    />

    <span class="vl-checkbox__box" :class="{ 'vl-checkbox__box--checked': isChecked }">
      <span v-if="isChecked" class="vl-checkbox__tick">✓</span>
    </span>

    <span class="vl-checkbox__label">
      <slot name="checkbox-label">
        {{ id }}
      </slot>
    </span>
  </label>
</template>

<script setup>
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  isChecked: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:isChecked']);

function onChange(event) {
  emit('update:isChecked', event.target.checked);
}
</script>

<style scoped>
.vl-checkbox {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  user-select: none;
}

.vl-checkbox__input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.vl-checkbox__box {
  width: 1.2rem;
  height: 1.2rem;
  border: 1.5px solid #b7c0cc;
  border-radius: 0.3rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: white;
  flex-shrink: 0;
  transition: 0.15s ease;
}

.vl-checkbox__box--checked {
  background: #43abff;
  border-color: #43abff;
  color: white;
}

.vl-checkbox__tick {
  font-size: 0.8rem;
  line-height: 1;
}

.vl-checkbox__label {
  display: inline-flex;
  align-items: center;
  min-width: 0;
}
</style>