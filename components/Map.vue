<template>
  <div class="map-container">
    <div id="map"></div>
    <MapPopup
        :tour="selectedTour"
        :closeTooltip="closeTooltip"
        v-model:isVisible="localShowMapPopup"
    />
  </div>
</template>

<script setup>
import { ref, onMounted  } from 'vue'
import MapPopup from '@/components/MapPopup.vue'; 
import { useMapInitializer } from '@/composables/useMapInitializer.js'

const selectedTour = ref(null);

let map;
let geoData;
let closeTooltip = null;
const localShowMapPopup = ref(false);

onMounted(() => {
  ({map, geoData, closeTooltip } = useMapInitializer(tours, findTours, () => {localShowMapPopup.value = false;}));
  // console.log(`Viewport: ${window.innerWidth}px X ${window.innerHeight}px`);
});

const tours = computed(() =>
  geoData.features?.map(f => ({
    ...f.properties,
    ...f.geometry,
  })) || []
);


function findTours(id) {
  if(!(toRaw(selectedTour.value) === tours.value.find(t => t.id === id))){
    selectedTour.value = tours.value.find(t => t.id === id);
    localShowMapPopup.value = true    
  } else {
    localShowMapPopup.value = !localShowMapPopup.value;
  }
  map.easeTo({ center: selectedTour.value.coordinates });
};

</script>

