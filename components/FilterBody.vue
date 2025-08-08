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
        <div class="row-layout filter-body__enviroment-checkboxes">
            <!-- <RadioButton 
                :isChecked="getFilters('isIndoors') === true"
                :id="`isIndoors`"
                @update:isChecked="(isChecked) => setIndoors(true, isChecked)"
                class="filter-body__indoors-checkbox"
            >
                <template #radioButton-label>
                    <IconLabel :icon="indoorsIcon" :label="`Indoors`" :showLabel="true" :size="`small`" />
                </template>
            </RadioButton>

            <RadioButton 
                :isChecked="getFilters('isIndoors') === false"
                :id="`isOutdoors`"
                @update:isChecked="(isChecked) => setIndoors(false, isChecked)"
                class="filter-body__indoors-checkbox"
            >
                <template #radioButton-label>
                    <IconLabel :icon="outdoorsIcon" :label="`Outdoors`" :showLabel="true" :size="`small`" />
                </template>
            </RadioButton> -->
            
            <RadioButtons
                v-model="selectedEnvironment"
                :radioButtons="radioButtons"
                groupName="environment-filter"
                :layout="'row'"
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
import { Button, Checkbox } from 'vue-library';
import RadioButton from '@/components/RadioButton.vue';
import RadioButtons from '@/components/RadioButtons.vue';

import IconLabel from '@/components/IconLabel.vue';
import { availableLanguages, availableCategories, availableCountries, matchCategory } from '@/utils/tourInfo.js'
import { getFilters, setFilters, pushFilters } from '@/composables/useMapFilters.js'

import indoorsIcon from '@/assets/icons/indoors.svg';
import outdoorsIcon from '@/assets/icons/outdoors.svg';
import dropdown_hide from '@/assets/icons/dropdown-light.svg';
import dropdown_show from '@/assets/icons/dropdown.svg'; 

const isMobile = () => window.innerWidth <= 768;

function handleFilter(newFilterObject, isChecked, typeOfFilter) {
    if (isChecked) {
        pushFilters(typeOfFilter, newFilterObject);
    } else if (!isChecked) {
        removeFilters(typeOfFilter, newFilterObject);
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

let dropDownImage = ref(dropdown_hide)
const scrollFullyDown = inject('scrollFullyDown');

function toogleDropdown() {
    console.log('AAA')
    if(dropDownImage.value === dropdown_hide) {
        dropDownImage.value = dropdown_show
        scrollFullyDown()
    } else {
        dropDownImage.value = dropdown_hide
    }
}
const selectedEnvironment = ref(null); // true or false

const radioButtons = [
    { icon: indoorsIcon, label: 'Indoors', showLabel: true, size: 'small'    },
    { icon: outdoorsIcon, label: 'Outdoors', showLabel: true, size: 'small' }
];

</script>