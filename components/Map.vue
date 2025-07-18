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
import { useTooltip } from '@/composables/useTooltip.js'

// const config = useRuntimeConfig();

let map;
let geoData = ref({});
let setCurrentTour;

onMounted(() => {
  
  const result = useMapInitializer();

  map = result.map
  geoData.value = result.geoData.value
  
  const tooltip = useTooltip(tours, map);
  setCurrentTour = tooltip.setCurrentTour;

});

const tours = computed(() =>
  geoData.value?.features?.map(f => ({
    ...f.properties,
  })) || []
);

</script>


 
