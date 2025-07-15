<template>
    <h2>Clio Muse Map Explorer</h2>
    <div id="map" class="map-container"></div>
</template>


<script setup lang="ts">
import { ref, onMounted, toRaw  } from 'vue'
import mapboxgl from 'mapbox-gl'

let map: mapboxgl.Map;

onMounted(() => {

  mapboxgl.accessToken = 'pk.eyJ1IjoiZHMxMjNmMTUiLCJhIjoiY21jeGdvYnU0MGN3YzJsc2J4MWYzNGdkYiJ9.DoJqvXGIjVQcXt3Vx-n9AQ'

  map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [23.712889, 37.989478],
    projection: 'mercator',
    dragRotate: false,
    pitchWithRotate: false,
    minZoom: 1.7,   
    zoom: 5
  });

  const marker = new mapboxgl.Marker({color: `#D54552`}).setLngLat([23.7261, 37.9715]).addTo(map); 
  const marker_2 = new mapboxgl.Marker({ color: '#D54552'}).setLngLat([22.5010, 38.4808]).addTo(map);  

  // Control:
  map.addControl(new mapboxgl.FullscreenControl(), 'top-right');

  map.addControl(
    new mapboxgl.NavigationControl({
      showZoom: true,    
      showCompass: false 
    }),
    'top-right'
  );

  map.addControl(new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true
    },
    trackUserLocation: true,
    showUserHeading: true
  }), 'top-right');

  console.log('Viewport:', window.innerWidth + ' x ' + window.innerHeight);


});


</script>


 