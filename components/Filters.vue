<template>
  <header class="filters row-layout" style="align-items: center;">
    <img v-if="isMobile()" class="filters__logo" :src="smallLogoNoLogotype" alt="Clio Muse logo"/>
    <img v-else class="filters__logo" :src="smallLogoRedHorizontal" alt="Clio Muse logo" />

    <div class="filters__center-group">
        <Text
          v-model="text"
          :placeholder="searchBarText"
          :icon="iconMagnifier"
          :iconPosition="'left'"
          @keydown.enter="handleEnter"
          :style="{ width: textWidth, height: '2.5rem' }"
          ref="textRef"
          @mousedown="hideOutline"
        />
        
        <Button
          :text="filterText"
          :buttonClass="`button__white`"
          :icon="filterIcon"
          class="filters__options"
        />
  
    </div>
  </header>

  <Window
      v-model:isVisible="showWindow"
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
import { smallLogoNoLogotype, smallLogoRedHorizontal, Text, Button } from 'vue-library';
import iconMagnifier from '@/assets/icons/magnifier.svg';
import filterIcon from '@/assets/icons/filterIcon.svg';
import FilterBody from '@/components/FilterBody.vue';
import { updateGeoData } from '../composables/updateGeoData';
import { clearAllFilters } from '@/composables/useMapFilters.js'
import { usePinHighlight } from '@/composables/tooltip/usePinHighlight.js';
import Window from '@/components/Window.vue'
import { showControl, hideControl } from '@/composables/map/useMapControls.js'
import { hideOutline } from '@/utils/handleOutline.js'

import Bugsnag from '@bugsnag/js';

const isMobile = () => window.innerWidth <= 768;

const text = ref('');
const showWindow = ref(false);

const props = defineProps({
  map: Object,
  geoData: Object,
  closeTooltip: Function,
  control: Object,
  closeMapPopup: Function,
});

function openFilterWindow() {
  usePinHighlight(props.map, -1)
  props.closeMapPopup()
  props.closeTooltip(true)
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

watch(showWindow, () => {
  if(isMobile()) {
    if(showWindow.value) {
      hideControl(props.map, props.control);
    } else {
      showControl(props.map, props.control)
    }
  }
});

// Handle clickOutside, Logic for Closing Window when clicking outside of it: ===================================================

const windowRef = ref(null)

function handleClickOutside(event) {
  try {
    if(showWindow.value === false) {
      const filterButton = document.querySelector('.filters__options'); 
      if (filterButton.contains(event.target)) {
        openFilterWindow();
        return;
      }
    } else {
      const header = document.querySelector('.window__header');
      const body = document.querySelector('.window__body');
      const footer = document.querySelector('.window__footer'); 
      if (header.contains(event.target) || body.contains(event.target) || footer.contains(event.target) || !showWindow.value) return;
      closeWindow();
    }
  } catch (err) {
    Bugsnag.notify(err.message, {
      severity: 'warning',
      context: 'Filters.vue handleClickOutside'
    });
  }
}

// Manage SearchBar Size and Placeholder  =========================================================================================

const smallWidth = () => window.innerWidth <= 420;

const searchBarText = ref('');
const filterText = ref('');
const textWidth = ref('17rem');

function updateWidth() {
  textWidth.value = smallWidth() ? '14.5rem' : '17rem';
}

const textRef = ref(null);

onMounted(() => {  
  updateWidth();
  searchBarText.value = 'Search a tour by location or title';
  if(!isMobile()) {
    filterText.value = 'Filters';
  } else {
    filterText.value = '';    
  }
  document.addEventListener('click', handleClickOutside);
  
  try {
    const img = textRef.value?.$el?.querySelector('.input_with_icon--left');
    if (!img) throw new Error('Magnifier icon element not found');
    img.setAttribute('alt', 'Magnifying glass for search');

  } catch (err) {
    Bugsnag.notify(err, event => {
      event.severity = 'warning';
      event.context = 'Filters.vue SearchBar';
    });  
  }
})

onUnmounted(() => {document.removeEventListener('click', handleClickOutside)})

function handleEnter() {
  console.log('Enter key pressed in the input');
}

</script>

