<template>
  <div class="header-bar row-layout" style="align-items: center;">
    <img v-if="isMobile()" class="header-bar__logo" :src="smallLogoNoLogotype" />
    <img v-else class="header-bar__logo" :src="smallLogoRedHorizontal" />

    <div class="header-bar__center-group" v-click-outside="blur">
        <Text
          v-model="text"
          :placeholder="searchBarText"
          :icon="iconMagnifier"
          :iconPosition="'left'"
          class="header-bar__search"
          @keydown.enter="handleEnter"
          @click="focus"
          :style="inputStyle"
        />
        <Button
          v-if="!isMobile()"
          :text="filterText"
          :buttonClass="`button__white`"
          :icon="filterIcon"
          class="header-bar__filters"
        />
        <img 
          v-else-if="!isFocused"
          class="header-bar__filters"
          :src="filterIcon"
        />
    </div>
  </div>

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
import { smallLogoNoLogotype, smallLogoRedHorizontal, Text, Button, Checkbox } from 'vue-library';
import iconMagnifier from '@/assets/icons/magnifier.svg';
import filterIcon from '@/assets/icons/filterIcon.svg';
import FilterBody from '@/components/FilterBody.vue';
import { updateGeoData } from '../composables/updateGeoData';
import { clearAllFilters } from '@/composables/useMapFilters.js'
import { usePinHighlight } from '@/composables/tooltip/usePinHighlight.js';
import Window from '@/components/Window.vue'
import { clickOutside } from 'vue-library';

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

// Handle clickOutside: =======================================================================================================

const windowRef = ref(null)

function handleClickOutside(event) {
  const filterButton = document.querySelector('.header-bar__filters'); 
  if(filterButton?.contains(event.target) && showWindow.value === false) {
    openFilterWindow()
    return
  }

  const header = document.querySelector('.window__header');
  const body = document.querySelector('.window__body');
  const footer = document.querySelector('.window__footer'); 
  if (header?.contains(event.target) || body?.contains(event.target) || footer?.contains(event.target) ||!showWindow.value) return;
  closeWindow();
}

// ==============================================================================================================================

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

const isFocused = ref(false);
const inputStyle = computed(() => ({
  width: isMobile()
    ? isFocused.value
      ? '17rem'
      : '7rem'  
    : '17rem',
  height: '2.5rem', 
}));

function handleEnter() {
  console.log('Enter key pressed in the input');
}

function focus() {
  if(isMobile()) searchBarText.value = 'Search a tour by location or title';
  isFocused.value = true
}

function blur() {
  if(isMobile()) searchBarText.value = 'Search';
  isFocused.value = false;
}

</script>

<script>
import { defineComponent, ref} from 'vue';
import { clickOutside } from 'vue-library';

export default defineComponent({
  directives: {
    'click-outside': clickOutside,
  }
});
</script>