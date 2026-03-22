<!-- DefaultLayout.vue or wherever this is -->
<template>
  <div class="default-layout">
  <Filters v-if="showFilterHeader" 
          :map="refs.map.value" 
          :geoData="refs.geoData.value" 
          :closeTooltip="refs.closeTooltip.value" 
          :control="refs.control.value" 
          :closeMapPopup="refs.closeMapPopup.value" />
  <Map @init="onMapInit" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Map from '../components/Map.vue';
import Filters from '@/components/Filters.vue';
import { resetAllInputOutlines } from '@/utils/handleOutline.js'; // wherever you put it
import Bugsnag from '@bugsnag/js';

const refs = {
  map: ref(null),
  geoData: ref(null),
  closeTooltip: ref(null),
  control: ref(null),
  closeMapPopup: ref(null)
};

const showFilterHeader = ref(true);

function onMapInit(map, geoData, closeTooltip, control, closeMapPopup) {
  const values = { map, geoData, closeTooltip, control, closeMapPopup };

  // Missing / null param check
  const missingKey = Object.keys(values).find(key => values[key] == null);
  if (missingKey) {
    Bugsnag.notify(new Error(`Map init parameter is missing: ${missingKey}`), event => {
      event.severity = 'warning';
      event.context = 'DefaultLayout:onMapInit';
    });
  }

  Object.keys(refs).forEach(key => {
    refs[key].value = values[key];
  });
}

const handleTab = (event) => {
  if (event.key === 'Tab') resetAllInputOutlines();
};
const handleFullscreenchange = () => {
  showFilterHeader.value = !document.fullscreenElement; 
}

onMounted(() => {
  document.addEventListener('keydown', handleTab);
  document.addEventListener('fullscreenchange', handleFullscreenchange);
});
onUnmounted(() => {
  document.removeEventListener('keydown', handleTab);
  document.removeEventListener('fullscreenchange', handleFullscreenchange);

});

</script>
