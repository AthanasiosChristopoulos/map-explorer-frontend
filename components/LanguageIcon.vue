<template>
  <div class="language-icon" :class="{ 'language-icon--small': props.size === 'small'}">
    <img class="language-icon__image" :src="matchLanguageIcon(props.language)" :alt="language" />
    <span class="language-icon__label" v-if="showLabel">{{ languageLabel }}</span>
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
    required: true,
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
});

const languageLabel = computed(() => languageDataMap[props.language]);

</script>