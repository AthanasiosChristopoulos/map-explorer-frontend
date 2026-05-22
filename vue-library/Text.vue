<template>
  <div
    class="vl-text"
    :class="[
      wrapperClass,
      { 'vl-text--with-icon-left': icon && iconPosition === 'left' }
    ]"
  >
    <img
      v-if="icon && iconPosition === 'left'"
      :src="icon"
      alt=""
      class="vl-text__icon vl-text__icon--left"
    />

    <input
      class="vl-text__input"
      :class="[
        inputClass,
        { 'vl-text__input--no-padding': noPadding }
      ]"
      :value="modelValue"
      :placeholder="placeholder"
      :type="type"
      @input="onInput"
      @focus="$emit('focus', $event)"
      @blur="$emit('blur', $event)"
      @click="$emit('click', $event)"
      @keydown="$emit('keydown', $event)"
      @keydown.enter="$emit('keydown.enter', $event)"
    />

    <img
      v-if="icon && iconPosition === 'right'"
      :src="icon"
      alt=""
      class="vl-text__icon vl-text__icon--right"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  placeholder: {
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
  type: {
    type: String,
    default: 'text',
  },
  noPadding: {
    type: Boolean,
    default: false,
  },
  inputClass: {
    type: String,
    default: '',
  },
  wrapperClass: {
    type: String,
    default: '',
  },
});

const emit = defineEmits([
  'update:modelValue',
  'focus',
  'blur',
  'click',
  'keydown',
  'keydown.enter',
]);

function onInput(event) {
  emit('update:modelValue', event.target.value);
}
</script>

<style scoped>
.vl-text {
  position: relative;
  display: inline-flex;
  align-items: center;
  width: 100%;
}

.vl-text__input {
  width: 100%;
  min-height: 2.5rem;
  border: 1px solid #d8dee8;
  border-radius: 999px;
  padding: 0.65rem 0.95rem;
  font: inherit;
  outline: none;
  background: white;
  color: #1f2430;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.vl-text--with-icon-left .vl-text__input {
  padding-left: 2.4rem;
}

.vl-text__input--no-padding {
  padding: 0;
}

.vl-text__input:focus {
  border-color: #43abff;
  box-shadow: 0 0 0 3px rgba(67, 171, 255, 0.14);
}

.vl-text__icon {
  position: absolute;
  width: 1rem;
  height: 1rem;
  object-fit: contain;
  pointer-events: none;
}

.vl-text__icon--left {
  left: 0.85rem;
}

.vl-text__icon--right {
  right: 0.85rem;
}
</style>