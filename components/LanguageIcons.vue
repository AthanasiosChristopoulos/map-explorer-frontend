<template>

    <Tooltip :align="'over'">
        <template v-slot:anchor>
            <div class="language-icons__list">
                <img :src="matchLanguageIcon(firstLanguage)">
                <img :src="matchLanguageIcon(secondLanguage)" style="margin-left: -0.8rem">
                <div class="language-icons__circle" v-if="fullLanguageList.length > 2" style="margin-left: -0.8rem">+{{ extraLanguageCount}}</div>
            </div>
        </template>

        <template v-slot:tooltip-content v-if="fullLanguageList.length > 2">
            <div class="language-icons__list" style="margin-right: -0.5rem; line-height: 0">
                <img v-for="language in fullLanguageList" :src="matchLanguageIcon(language)" style="margin-right: 0.5rem;">
            </div>
        </template>
    </Tooltip>

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

const firstLanguage = computed(() => props.languages[0]);
const secondLanguage = computed(() => props.languages[1]);
const extraLanguageCount = computed(() => props.languages.length - 2);
const fullLanguageList = computed(() => props.languages);
</script>
