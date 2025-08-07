<template>
  <div class="icon-label" :class="{ 'icon-label--small': props.size === 'small' }">
    <img
      class="icon-label__image"
      :class="{ 'icon-label--border-circle': props.language, 'icon-label__image--category-icon': props.categoryIcon }"
      :src="resolvedIcon"
      :alt="resolvedLabel"
    />
    <span class="icon-label__label" v-if="props.showLabel">{{ resolvedLabel }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { matchLanguageIcon } from '@/utils/tourInfo.js';

const languageDataMap = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  gr: 'Greek',
  it: 'Italian',
  pt: 'Portuguese',
  de: 'German',
};

const props = defineProps({
  language: {
    type: String,
    required: false,
  },
  size: {
    type: String,
    default: 'normal',
    validator: (value) => ['normal', 'small'].includes(value),
  },
  showLabel: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: String,
    default: null,
  },
  label: {
    type: String,
    default: null,
  },
  categoryIcon: {
    type: Boolean,
    default: false,
  }
});

const resolvedIcon = computed(() =>
  props.icon || matchLanguageIcon(props.language)
);

const resolvedLabel = computed(() =>
  props.label || languageDataMap[props.language] || props.language
);
</script>
