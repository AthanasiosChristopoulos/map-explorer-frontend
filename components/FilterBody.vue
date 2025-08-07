<template>
    <div class="column-layout" style="gap: 1rem;">
        <h3>Tour language</h3>
        <div class="filter-body__language-checkboxes">
            <Checkbox 
                v-for="language in availableLanguages" 
                :key="language" 
                :id="language"
                :isChecked="getFilters('languages')?.includes(language)"
                @update:isChecked="(isChecked) => toggleLanguage(language, isChecked)"
            >
                <template #checkbox-label>
                    <IconLabel :language="language" :showLabel="true" :size="`small`" />
                </template>
            </Checkbox>
        </div>

        <div class="divider"></div>

        <h3>Indoor or Outdoor Tour</h3>
        <div class="row-layout" style="gap: 2.5rem;">
            <Checkbox 
                :isChecked="getFilters('isIndoors') === true"
                :id="`isIndoors`"
                @update:isChecked="(isChecked) => setIndoors(true, isChecked)"
                class="filter-body__indoors-checkbox"
            >
                <template #checkbox-label>
                    <IconLabel :icon="indoorsIcon" :label="`Indoors`" :showLabel="true" :size="`small`" />
                </template>
            </Checkbox>

            <Checkbox 
                :isChecked="getFilters('isIndoors') === false"
                :id="`isOutdoors`"
                @update:isChecked="(isChecked) => setIndoors(false, isChecked)"
                class="filter-body__indoors-checkbox"
            >
                <template #checkbox-label>
                    <IconLabel :icon="outdoorsIcon" :label="`Outdoors`" :showLabel="true" :size="`small`" />
                </template>
            </Checkbox>
        </div>

        <div class="divider"></div>
        
        <h3>Tour Category</h3>

        <div class="filter-body__language-checkboxes">
            <Checkbox 
                v-for="category in availableCategories" 
                :key="category" 
                :id="category"
                :isChecked="getFilters('categories')?.includes(category)"
                @update:isChecked="(isChecked) => toggleCategory(language, isChecked)"
            >
                <template #checkbox-label>
                    <IconLabel :language="language" :showLabel="true" :size="`small`" />
                </template>
            </Checkbox>
        </div>

    </div>

</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Checkbox } from 'vue-library';
import IconLabel from '@/components/IconLabel.vue';
import { availableLanguages, availableCategories } from '@/utils/mapPopupUtils.js'
import indoorsIcon from '@/assets/icons/indoors.svg';
import outdoorsIcon from '@/assets/icons/outdoors.svg';
import { getFilters, setFilters, pushFilters } from '@/composables/useMapFilters.js'

function toggleLanguage(language, isChecked) {
    console.log(language)
    console.log(isChecked)

    if (isChecked) {
        pushFilters('languages', language);
    } else if (!isChecked) {
        removeFilters('languages', language);
    }
}

function toggleLanguage(language, isChecked) {
    console.log(language)
    console.log(isChecked)

    if (isChecked) {
        pushFilters('languages', language);
    } else if (!isChecked) {
        removeFilters('languages', language);
    }
}
function setIndoors(isIndoors, isChecked) {
    if (!isChecked) {
        setFilters('isIndoors', null);
    } else {
        if (isIndoors === true) {
            setFilters('isIndoors', true);
        } else {
            setFilters('isIndoors', false);
        }
    }
};
</script>