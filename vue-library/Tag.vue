<template>
  <span
    class="vl-tag"
    :class="{ 'vl-tag--small': small }"
    :style="tagStyle"
  >
    {{ label }}
  </span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  backgroundColor: {
    type: String,
    default: '#EEF2F7',
  },
  textColor: {
    type: String,
    default: '#243042',
  },
  small: {
    type: Boolean,
    default: false,
  },
});

const tagStyle = computed(() => ({
  backgroundColor: props.backgroundColor,
  color: props.textColor,
}));
</script>

<style scoped>
.vl-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 0.75em 1rem;
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
}

.vl-tag--small {
  font-size: 0.8rem;
  padding: 0.5em 0.8rem;
}
</style>