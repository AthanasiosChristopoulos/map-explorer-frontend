<template>
    <div id="map" class="map-container"></div>
</template>


<script setup>
import { ref, onMounted, toRaw  } from 'vue'
import mapboxgl from 'mapbox-gl'
import pin_image from '@/assets/icons/map-pin-fill.png';
import { useRuntimeConfig } from '#app';
import mapConfig from '@/assets/map/map-config.json';
import { toGeoJSON } from '@/utils/toGeoJSON';
// import tour_data from '@/assets/data/tour.json';
import tour_data from '@/assets/data/tour_data.json';
import { useMapInitializer } from '@/composables/useMapInitializer.js'

// const config = useRuntimeConfig();

let map;
let popup;
let geoData = ref({});

onMounted(() => {
  const result = useMapInitializer(setCurrentTour);
  map = result.map
  popup = result.popup
  geoData.value = result.geoData.value
});

const tours = computed(() =>
  geoData.value.features.map(f => ({
    ...f.properties,                    
  }))
);

function setCurrentTour(id, lngLat) {
  const tour = tours.value.find(t => String(t.id) === String(id));

  popup.setHTML(`
    <div class="tooltip-title">
      <h3>${tour.title}</h3>
    </div>
    <p>This is your tooltip content</p>
  `).addTo(map).setLngLat(lngLat);
};
  
</script>


 
