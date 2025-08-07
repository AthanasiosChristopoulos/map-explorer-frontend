<!-- DefaultLayout.vue or wherever this is -->
<template>
  <div class="default-layout">
    <Filters :map="map" :geoData="geoData" />
    <Map @init="onMapInit" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Map from '../components/Map.vue';
import Filters from '@/components/Filters.vue';

const map = ref(null);
const geoData = ref(null);

function onMapInit({ map: m, geoData: g }) {
  map.value = m;
  geoData.value = g;
}
</script>
