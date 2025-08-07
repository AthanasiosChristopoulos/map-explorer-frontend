<template>
  <div class="map-container">
    <div id="map"></div>
    <MapPopup
        v-if="mapReady"
        :mapReady="mapReady"
        :tour="selectedTour"
        :closeTooltip="closeTooltip"
        :map="map"
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
let mapReady = ref(false);

const tours = computed(() =>
  geoData.features?.map(f => ({
    ...f.properties,
    ...f.geometry,
  })) || []
);

const emit = defineEmits(['init']);

onMounted(async() => {
  ({map, geoData, closeTooltip } = await useMapInitializer(tours, findTours, () => {localShowMapPopup.value = false;}));
  mapReady.value = true;
  emit('init', { map, geoData });
});

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

