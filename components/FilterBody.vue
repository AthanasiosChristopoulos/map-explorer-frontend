<template>
    <div class="column-layout" style="gap: 1.5rem;">
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

        <div class="divider" style="margin-bottom: -0.5rem"></div>

        <h3>Indoor or Outdoor Tour</h3>
        <div class="row-layout filter-body__enviroment-checkboxes">
            <Checkbox 
                :isChecked="getFilters('isIndoors') === true"
                :id="`isIndoors`"
                @update:isChecked="(isChecked) => setIndoors(true, isChecked)"
                class="filter-body__indoors-checkbox"
                :enviromentCheckbox="true"
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
                :enviromentCheckbox="true"
            >
                <template #checkbox-label>
                    <IconLabel :icon="outdoorsIcon" :label="`Outdoors`" :showLabel="true" :size="`small`" />
                </template>
            </Checkbox>
        </div>

        <div class="divider"></div>
        
        <h3>Tour Category</h3>

        <div class="filter-body__category-checkboxes">
            <Checkbox 
                v-for="category in availableCategories" 
                :key="category" 
                :id="category"
                :isChecked="getFilters('categories')?.includes(category)"
                @update:isChecked="(isChecked) => toggleCategory(category, isChecked)"
            >
                <template #checkbox-label>
                    <IconLabel 
                        :icon="matchCategory(category).icon" 
                        :label="category" 
                        :categoryIcon="true" 
                        :showLabel="true" 
                        :size=" isMobile() ? 'small': 'normal'" 
                    />
                </template>
            </Checkbox>
        </div>
    </div>

</template>

<script setup>
import { ref, onMounted } from 'vue';
// import { Checkbox } from 'vue-library';
import Checkbox from '@/components/Checkbox.vue';
import IconLabel from '@/components/IconLabel.vue';
import { availableLanguages, availableCategories, matchCategory } from '@/utils/tourInfo.js'
import indoorsIcon from '@/assets/icons/indoors.svg';
import outdoorsIcon from '@/assets/icons/outdoors.svg';
import { getFilters, setFilters, pushFilters } from '@/composables/useMapFilters.js'

const isMobile = () => window.innerWidth <= 768;

function toggleLanguage(language, isChecked) {
    console.log(language)
    console.log(isChecked)
    if (isChecked) {
        pushFilters('languages', language);
    } else if (!isChecked) {
        removeFilters('languages', language);
    }
}

function toggleCategory(category, isChecked) {
    console.log(category)
    console.log(isChecked)
    if (isChecked) {
        pushFilters('categories', category);
    } else if (!isChecked) {
        removeFilters('categories', category);
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