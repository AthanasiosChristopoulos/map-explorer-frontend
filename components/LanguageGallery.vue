<template>
    <Popover :align="`top`" v-if="languageData.fullList.length > 2" @popover-toggle="handlePopoverToggle">
        <template v-slot:anchor>
            <div class="language-gallery__list">
                <IconLabel :language="languageData.first" />
                <IconLabel :language="languageData.second" style="margin-left: -0.8rem" />
                <div class="language-gallery__circle" style="margin-left: -0.8rem">+{{ languageData.extraCount}}</div>
            </div>
        </template>

        <template v-slot:content>
            <div class="language-gallery__list--scrollable">
                <IconLabel v-for="language in languageData.fullList" :language="language" :showLabel="true" :size="`small`" />
            </div>
        </template>
      </Popover>

    <div class="language-gallery__list" v-else>
        <IconLabel :language="languageData.first" />
        <IconLabel :language="languageData.second" style="margin-left: -0.8rem" v-if="languageData.second" />
    </div>

</template>

<script setup>
import { computed } from 'vue';
import { Popover } from '~/vue-library'; 
import IconLabel from '@/components/IconLabel.vue';

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

const emit = defineEmits(['popover-toggle']);

function handlePopoverToggle(val) {emit('popover-toggle', val)}
</script>
