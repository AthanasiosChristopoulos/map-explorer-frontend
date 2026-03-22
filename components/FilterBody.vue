<template>
    <div class="column-layout" style="gap: 1.5rem;">
        <h3>Tour language</h3>
        <div class="filter-body__language-checkboxes">
            <Checkbox 
                v-for="language in availableLanguages" 
                :key="language" 
                :id="language"
                :isChecked="getFilters('languages')?.includes(language)"
                @update:isChecked="(isChecked) => handleFilter(language, isChecked, 'languages')"
                @mousedown="hideOutline"
            >
                <template #checkbox-label>
                    <IconLabel 
                        :label="languageLabelMap[language]" 
                        :icon="matchLanguageIcon(language)" 
                        :showLabel="true" 
                        :size="`small`" 
                        :iconClass="'icon-label--border-circle'"
                    />
                </template>
            </Checkbox>
        </div>

        <div class="divider" style="margin-bottom: -0.5rem"></div>

        <h3>Indoor or Outdoor Tour</h3>
        <div class="filter-body__enviroment-radio-buttons">
            <div v-for="option in radioButtons" ref="radioButtonRefs">
                <Radio
                    :key="option.id"
                    v-model="selectedRadio"
                    :value="option"
                    :id="`{option.id}`"
                    :name="option.name"
                    class="filter-body__radio-button"
                >
                    <IconLabel
                        :icon="option.icon"
                        :label="option.name"
                        :showLabel="option.showLabel"
                        :size="option.size"
                    />
                </Radio>
            </div>

        </div>

        <div class="divider"></div>
        
        <h3>Tour Category</h3>

        <div class="filter-body__grid_2_checkboxes">
            <Checkbox 
                v-for="category in availableCategories" 
                :key="category" 
                :id="category"
                :isChecked="getFilters('categories')?.includes(category)"
                @update:isChecked="(isChecked) => handleFilter(category, isChecked, 'categories')"
                @mousedown="hideOutline"
            >
                <template #checkbox-label>
                    <IconLabel 
                        :icon="matchCategory(category).icon" 
                        :label="category" 
                        :showLabel="true" 
                        :size=" isMobile() ? 'small': 'normal'" 
                        :iconClass="'icon-label__image--category-icon'"
                    />
                </template>
            </Checkbox>
        </div>

        <div class="divider"></div>

        <div class="row-layout" @click="toogleDropdown" style="justify-content: space-between; align-items: center; cursor: pointer">
            <h3>Country</h3>
            <Button
                :icon="dropDownImage" 
                class="fit-content-button"  
                style="scale: 0.8;"  
            />
        </div>

        <div class="filter-body__grid_2_checkboxes" v-if="dropDownImage === dropdown_show">
            <Checkbox 
                v-for="country in availableCountries" 
                :key="country" 
                :id="country"
                :isChecked="getFilters('countries')?.includes(country)"
                @update:isChecked="(isChecked) => handleFilter(country, isChecked, 'countries')"
                @mousedown="hideOutline"
            >
                <template #checkbox-label>
                    <IconLabel :label="country" :showLabel="true" :size="'normal'" style="padding: 0.2rem 0rem;"/>
                </template>
            </Checkbox>
        </div>
    </div>

</template>

<script setup>
import { ref, inject, watch, onMounted } from 'vue';
import { Button, Checkbox, Radio } from 'vue-library';

import IconLabel from '@/components/IconLabel.vue';
import { availableLanguages, availableCategories, availableCountries, matchCategory, 
    languageLabelMap, matchLanguageIcon } from '@/utils/tourInfo.js'
import { getFilters, setFilters, pushFilters } from '@/composables/useMapFilters.js'
import { hideOutline } from '@/utils/handleOutline.js'

import indoorsIcon from '@/assets/icons/indoors.svg';
import outdoorsIcon from '@/assets/icons/outdoors.svg';
import dropdown_hide from '@/assets/icons/dropdown-light.svg';
import dropdown_show from '@/assets/icons/dropdown.svg'; 

import Bugsnag from '@bugsnag/js';

const isMobile = () => window.innerWidth <= 768;

const requiredAvailableData = { 
  availableLanguages, 
  availableCategories, 
  availableCountries 
};

// Checkbox Logic ============================================================================================

function handleFilter(newFilterObject, isChecked, typeOfFilter) {
    if (isChecked) {
        pushFilters(typeOfFilter, newFilterObject);
    } else if (!isChecked) {
        removeFilters(typeOfFilter, newFilterObject);
    }
}

// RadioButton Logic ============================================================================================

const radioButtons = [
    { id: 1, name: 'Indoor', icon: indoorsIcon, showLabel: true, size: 'small', value: true},
    { id: 2, name: 'Outdoor', icon: outdoorsIcon, showLabel: true, size: 'small', value: false }
];

let selectedRadio = ref({});
const radioButtonRefs = ref([])

onMounted(async() => {
    const missingKey = Object.keys(requiredAvailableData).find(key => !requiredAvailableData[key]?.length);
    if (missingKey) {
        Bugsnag.notify(new Error(`${missingKey} array is missing or empty`), event => {
            event.severity = 'error';
            event.context = 'FiltersBody.vue';
        });
    }
    selectedRadio.value = getIndoors()
    await nextTick()
    const widths = radioButtonRefs.value.map(el => el.offsetWidth)
    const maxWidth = Math.max(...widths)
    radioButtonRefs.value.forEach(el => {el.style.width = maxWidth + 'px'})
})

watch(selectedRadio, (newVal) => {
    if (newVal) setIndoors(newVal)
    else setIndoors(null)
});

function getIndoors() {
    return radioButtons.find(enviromentData => enviromentData.value === getFilters('isIndoors')) || {};
}
function setIndoors(enviromentData) {
    if (enviromentData == null) setFilters('isIndoors', null);
    else setFilters('isIndoors', enviromentData.value);
};

// Dropdown Logic ============================================================================================

let dropDownImage = ref(dropdown_hide)
const scrollFullyDown = inject('scrollFullyDown');

function toogleDropdown() {
    if(dropDownImage.value === dropdown_hide) {
        dropDownImage.value = dropdown_show
        scrollFullyDown()
    } else {
        dropDownImage.value = dropdown_hide
    }
}

</script>