<!-- DefaultLayout.vue or wherever this is -->
<template>
  <div class="default-layout">
    <Filters :map="map" :geoData="geoData" :closeTooltip="closeTooltip" :closeMapPopup="closeMapPopup" />
    <Map @init="onMapInit" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Map from '../components/Map.vue';
import Filters from '@/components/Filters.vue';

const map = ref(null);
const geoData = ref(null);
const closeTooltip = ref(null);
const closeMapPopup = ref(null);

function onMapInit(map_parameter, geoData_parameter, closeTooltip_parameter, closeMapPopup_parameter) {
  map.value = map_parameter;
  geoData.value = geoData_parameter;
  closeTooltip.value = closeTooltip_parameter;
  closeMapPopup.value = closeMapPopup_parameter;
}

</script>
