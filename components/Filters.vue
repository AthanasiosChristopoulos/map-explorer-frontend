<template>
  <div class="header-bar">
    <img class="header-bar__logo" :src="smallLogoRedHorizontal" />

    <div class="header-bar__center-group">
      <div class="header-bar__search-wrapper">
        <Text
          v-model="text"
          :placeholder="'Search by location, title'"
          :icon="iconMagnifier"
          :iconPosition="'left'"
          class="header-bar__search"
        />
        <Button
          :text="`Filters`"
          :buttonClass="`button__white`"
          :icon="filterIcon"
          @click="openFilterWindow"
          class="header-bar__filters"
        />
      </div>
    </div>
  </div>

  <Window
      :isVisible="showWindow"
      :leftButtonText="'Clear All'"
      :rightButtonText="'Apply Filters'"
      :leftButtonDisabled="false"
      :rightButtonDisabled="false"
      @left-action="clearAll"
      @right-action="applyFilters"
      @close="closeWindow"
  >
      <template v-slot:window__header>
          <h1>Filters</h1>
      </template>

      <template v-slot:window__body>
        <FilterBody />
      </template>

  </Window>

</template>


<script setup>
import { ref } from 'vue';
import { smallLogoRedHorizontal, Text, Button, Window, Checkbox } from 'vue-library';
import iconMagnifier from '@/assets/icons/magnifier.svg';
import filterIcon from '@/assets/icons/filterIcon.svg';
import FilterBody from '@/components/FilterBody.vue';
import { updateGeoData } from '../composables/updateGeoData';
import { clearAllFilters } from '@/composables/useMapFilters.js'

const text = ref('');
const showWindow = ref(true);

const props = defineProps({
  map: Object,
  geoData: Object,
})

function openFilterWindow() {
  showWindow.value = true
}
function closeWindow() {
  showWindow.value = false
}

function clearAll() {
  clearAllFilters()
  updateGeoData(props.map, props.geoData)
}
function applyFilters() {
  updateGeoData(props.map, props.geoData)
  closeWindow()
}
</script>