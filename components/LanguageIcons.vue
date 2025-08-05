<template>
    <Tooltip :align="align_string" v-if="languageData.fullList.length > 2">
        <template v-slot:anchor>
            <div class="language-icons__list">
                <img :src="matchLanguageIcon(languageData.first)">
                <img :src="matchLanguageIcon(languageData.second)" style="margin-left: -0.8rem">
                <div class="language-icons__circle" style="margin-left: -0.8rem">+{{ languageData.extraCount}}</div>
            </div>
        </template>

        <template v-slot:tooltip-content>
            <div class="language-icons__list" style="margin-right: -0.5rem; line-height: 0">
                <img v-for="language in languageData.fullList" :src="matchLanguageIcon(language)" style="margin-right: 0.5rem;">
            </div>
        </template>
    </Tooltip>

    <div class="language-icons__list" v-else>
        <img :src="matchLanguageIcon(languageData.first)">
        <img :src="matchLanguageIcon(languageData.second)" style="margin-left: -0.8rem" v-if="languageData.second">
    </div>

</template>

<script setup>
import { computed } from 'vue';
import Tooltip from './Tooltip.vue'; 
import { matchLanguageIcon } from '@/utils/mapPopupUtils.js';

const props = defineProps({
  languages: {
    type: Array,
    required: true,
  },
});

const languageData = computed(() => {
  const languages = props.languages;
  return {
    fullList: languages,
    first: languages[0],
    second: languages[1],
    extraCount: languages.length > 2 ? languages.length - 2 : 0,
  };
});

const isMobile = () => window.innerWidth <= 768;
const align_string = computed(() => isMobile() ? 'over--right' : 'over');

</script>
