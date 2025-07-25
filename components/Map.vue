<template>
  <div class="map-container">
    <div id="map"></div>
    <MapPopup
        :tour="selectedTour"
        v-model:isVisible="localShowMapPopup"
    />
  </div>
</template>


<script setup>
import { ref, onMounted  } from 'vue'
import MapPopup from '@/components/MapPopup.vue'; 
import { useMapInitializer } from '@/composables/useMapInitializer.js'
import { useTooltip } from '@/composables/useTooltip.js'

const selectedTour = ref(null);

let map;
let geoData;

const localShowMapPopup = ref(false);

onMounted(() => {
  ({map, geoData} = useMapInitializer());
  useTooltip(tours, map, findTours);
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
  console.log(localShowMapPopup.value )
  map.easeTo({ center: selectedTour.value.coordinates });
};

</script>

