<template>
  <main class="map-container" aria-label="Map and controls">
    <div id="map"></div>
    <MapPopup
        v-if="mapReady"
        :mapReady="mapReady"
        :tour="selectedTour"
        :closeTooltip="closeTooltip"
        :map="map"
        v-model:isVisible="localShowMapPopup"
    />
  </main>

</template>

<script setup>
import { ref, onMounted  } from 'vue'
import MapPopup from '@/components/MapPopup.vue'; 
import { useMapInitializer } from '@/composables/useMapInitializer.js'
import { validateTour } from '@/utils/tourInfo.js'
import Bugsnag from '@bugsnag/js';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

const selectedTour = ref(null);
let map;
let geoData;
let closeTooltip = null;
let control;

const localShowMapPopup = ref(false);
let mapReady = ref(false);

const tours = computed(() =>
  geoData.features?.map(f => ({
    ...f.properties,
    ...f.geometry,
  })) || []
);

const emit = defineEmits(['init']);

onMounted(async() => {
  ({map, geoData, closeTooltip, control } = await useMapInitializer(tours, findTours, () => {localShowMapPopup.value = false;}));
  mapReady.value = true;
  emit('init', map, geoData, closeTooltip, control, closeMapPopup);

  // Accessibility: Labelling controlsContainer (otherwise accessibilitychecker complains that it doesnt have landmarks)
  try {
    const controlsContainer  = document.querySelector('.mapboxgl-control-container');
    if (!controlsContainer) throw new Error('mapboxgl-control-container does not exist in the DOM');
    controlsContainer.setAttribute('role', 'complementary');
    controlsContainer.setAttribute('aria-label', 'Map controls');
  } catch(err) {
    Bugsnag.notify(err, event => { 
      event.severity = 'warning';
      event.context = 'Map';
     });
  }
});

function findTours(id) {
  const foundTour = tours.value.find(t => t.id === id);
  if (!foundTour) {
    Bugsnag.notify(new Error(`Tour not found for id: ${id}`), event => {
      event.severity = 'warning';
      event.context = 'findTours';
    });
    return;
  }
  validateTour(foundTour);
  if(!(toRaw(selectedTour.value) === foundTour)){
    selectedTour.value = foundTour;
    localShowMapPopup.value = true    
  } else {
    localShowMapPopup.value = !localShowMapPopup.value;
  }
  if(!prefersReducedMotion) {
    map.easeTo({ center: selectedTour.value.coordinates });
  } 
  // If the user prefers reduced motion, you can either jump instantly to the location (jump to) or skip map re-centering entirely.
  // else { 
  //   map.jumpTo({ center: selectedTour.value.coordinates });
  // }
};

function closeMapPopup() {
  localShowMapPopup.value = false    
}

</script>

