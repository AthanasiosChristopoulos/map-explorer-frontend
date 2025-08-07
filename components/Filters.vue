<template>
  <div class="header-bar">
    <img v-if="isMobile()" class="header-bar__logo" :src="smallLogoNoLogotype" />
    <img v-else class="header-bar__logo" :src="smallLogoRedHorizontal" />

    <div class="header-bar__center-group">
      <div class="header-bar__search-wrapper">
        <Text
          v-model="text"
          :placeholder="searchBarText"
          :icon="iconMagnifier"
          :iconPosition="'left'"
          class="header-bar__search"
          :style="inputStyle"
        />
        <Button
          :text="filterText"
          :buttonClass="`button__white`"
          :icon="filterIcon"
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
      ref="windowRef"
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
import { smallLogoNoLogotype, smallLogoRedHorizontal, Text, Button, Checkbox } from 'vue-library';
import iconMagnifier from '@/assets/icons/magnifier.svg';
import filterIcon from '@/assets/icons/filterIcon.svg';
import FilterBody from '@/components/FilterBody.vue';
import { updateGeoData } from '../composables/updateGeoData';
import { clearAllFilters } from '@/composables/useMapFilters.js'
import { usePinHighlight } from '@/composables/tooltip/usePinHighlight.js';
import Window from '@/components/Window.vue'

const isMobile = () => window.innerWidth <= 768;

const text = ref('');
const showWindow = ref(true);

const props = defineProps({
  map: Object,
  geoData: Object,
  closeTooltip: Function,
  closeMapPopup: Function,
})

function openFilterWindow() {
  usePinHighlight(props.map, -1)
  props.closeMapPopup()
  props.closeTooltip(true)
  showWindow.value = true
}

function closeWindow() {
  console.log('closeWindow')
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

// Handle clickOutside: =================================================================================================================

const windowRef = ref(null)

function handleClickOutside(event) {
  const filterButton = document.querySelector('.header-bar__filters'); 
  if(filterButton?.contains(event.target)) {
    openFilterWindow()
    return
  }

  const header = document.querySelector('.window__header');
  const body = document.querySelector('.window__body');
  const footer = document.querySelector('.window__footer'); 
  if (header?.contains(event.target) || body?.contains(event.target) || footer?.contains(event.target) ||!showWindow.value) return;

  closeWindow();
}

const searchBarText = ref('');
const filterText = ref('');

onMounted(() => {
  if(!isMobile()) {
    searchBarText.value = 'Search a tour by location or title';
    filterText.value = 'Filters';
  } else {
    searchBarText.value = 'Search';
    filterText.value = '';    
  }
  document.addEventListener('click', handleClickOutside)}
)
onUnmounted(() => {document.removeEventListener('click', handleClickOutside)})

// Input Style: =================================================================================================================

const inputStyle = computed(() => ({
  width: isMobile() ? '7rem' : 'fit-content',
  height: '10rem',
}));

</script>
