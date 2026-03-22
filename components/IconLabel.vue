<template>
  <div class="icon-label" :class="{ 'icon-label--small': props.size === 'small' }">
    <img
      v-if="props.icon"
      class="icon-label__image"
      :class="iconClass"
      :src="props.icon"
      alt="Image of Label"
    />
    <span 
      class="icon-label__label" 
      v-if="props.showLabel" 
      :style="{ paddingLeft: props.icon ? '0rem' : '0.5rem'}"
    >
      {{ props.label }}
    </span>
  </div>
</template>

<script setup>

const props = defineProps({
  icon: {
    type: String,
    default: null,
  },
  label: {
    type: String,
    default: null,
  },  
  size: {
    type: String,
    default: 'normal',
    validator: (value) => ['normal', 'small'].includes(value),
  },
  iconClass: {
      type: [String, Array, Object],
      default: () => '',
  },
  showLabel: {
    type: Boolean,
    default: false,
  }
});

</script>
