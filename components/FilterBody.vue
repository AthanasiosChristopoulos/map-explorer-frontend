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
            >
                <template #checkbox-label>
                    <IconLabel :language="language" :showLabel="true" :size="`small`" />
                </template>
            </Checkbox>
        </div>

        <div class="divider" style="margin-bottom: -0.5rem"></div>

        <h3>Indoor or Outdoor Tour</h3>
        <div class="filter-body__enviroment-radio-buttons">
            <RadioButtons
                :radioButtons="radioButtons"
                groupName="environment-filter"
                :layout="'row'"
                :checkedRadioButton="getIndoors()"
                @update:checkedRadioButton="(enviromentData) => setIndoors(enviromentData)"
                style="gap: 4rem;"
            />

        </div>

        <div class="divider"></div>
        
        <h3>Tour Category</h3>

        <div class="filter-body__category-checkboxes">
            <Checkbox 
                v-for="category in availableCategories" 
                :key="category" 
                :id="category"
                :isChecked="getFilters('categories')?.includes(category)"
                @update:isChecked="(isChecked) => handleFilter(category, isChecked, 'categories')"
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

        <div class="divider"></div>

        <div class="row-layout" style="justify-content: space-between;">
            
            <h3>Country</h3>
            
            <Button
                :icon="dropDownImage" 
                :buttonClass="'button__ghost'"
                @click="toogleDropdown"
                style="width: fit-content; height: fit-content; padding: 0rem; scale: 1.5;"
            />
            
        </div>

        <div class="filter-body__category-checkboxes" v-if="dropDownImage === dropdown_show">
            <Checkbox 
                v-for="country in availableCountries" 
                :key="country" 
                :id="country"
                :isChecked="getFilters('countries')?.includes(country)"
                @update:isChecked="(isChecked) => handleFilter(country, isChecked, 'countries')"
            >
                <template #checkbox-label>
                    <IconLabel 
                        :label="country" 
                        :showLabel="true" 
                        :size="'normal'" 
                    />
                </template>
            </Checkbox>
        </div>
    </div>

</template>

<script setup>
import { ref, inject } from 'vue';
import { Button, Checkbox } from '~/vue-library';
import RadioButtons from '@/components/RadioButtons.vue';

import IconLabel from '@/components/IconLabel.vue';
import { availableLanguages, availableCategories, availableCountries, matchCategory } from '@/utils/tourInfo.js'
import { getFilters, setFilters, pushFilters } from '@/composables/useMapFilters.js'

import indoorsIcon from '@/assets/icons/indoors.svg';
import outdoorsIcon from '@/assets/icons/outdoors.svg';
import dropdown_hide from '@/assets/icons/dropdown-light.svg';
import dropdown_show from '@/assets/icons/dropdown.svg'; 

const isMobile = () => window.innerWidth <= 768;

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
    { icon: indoorsIcon, label: 'Indoors', showLabel: true, size: 'small', value: true},
    { icon: outdoorsIcon, label: 'Outdoors', showLabel: true, size: 'small', value: false }
];
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