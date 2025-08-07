<template>
  <div class="language-icon" :class="{ 'language-icon--small': props.size === 'small' }">
    <img
      class="language-icon__image"
      :src="resolvedIcon"
      :alt="resolvedLabel"
    />
    <span class="language-icon__label" v-if="props.showLabel">{{ resolvedLabel }}</span>
  </div>
</template>


<script setup>
import { computed } from 'vue';
import { matchLanguageIcon } from '@/utils/mapPopupUtils.js';

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
});

const resolvedIcon = computed(() =>
  props.icon || matchLanguageIcon(props.language)
);

const resolvedLabel = computed(() =>
  props.label || languageDataMap[props.language] || props.language
);
</script>
