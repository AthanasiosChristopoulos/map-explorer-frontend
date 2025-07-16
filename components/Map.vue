<template>
    <div id="map" class="map-container"></div>
</template>


<script setup lang="ts">
import { ref, onMounted  } from 'vue'
import mapboxgl from 'mapbox-gl'
import pin_image from '@/assets/icons/map-pin-fill.png';
import { useRuntimeConfig } from '#app';
import mapConfig from '@/assets/map/map-config.json';

const config = useRuntimeConfig();

let map: mapboxgl.Map;
let popup: mapboxgl.Popup;

const geoData = ref({});

onMounted(async() => {
  const res = await fetch('http://localhost:5001/data')
    .then(response => response.json())
    .then(data => {
        geoData.value = data;
    });

  console.log(config.public.MAPBOX_ACCESS_TOKEN);
  mapboxgl.accessToken = config.public.MAPBOX_ACCESS_TOKEN;

  map = new mapboxgl.Map(mapConfig.map);

  map.on('load', async () => {
    try {
      
      // Add image for the pin to the map
      const response = await fetch(pin_image);
      const blob = await response.blob();
      const imageBitmap = await createImageBitmap(blob);
      map.addImage('custom-pin', imageBitmap);

      map.addSource('points', { type: 'geojson', data: geoData.value });

      map.addLayer(mapConfig.pinLayer);
    } catch (err) {
      console.error('Error loading custom pin:', err);
    }
  });
    
  popup = new mapboxgl.Popup(mapConfig.popup).setHTML(`
      <div class="tooltip-title">
        <h3>TourTitle</h3>
      </div>
      <p>This is your tooltip content</p>
    `);

  //===============================================================================================
  // Control:

  map.addControl(new mapboxgl.FullscreenControl(), 'top-right');

  map.addControl(
    new mapboxgl.NavigationControl(mapConfig.controls.navigation),
    'top-right'
  );
  map.addControl(new mapboxgl.GeolocateControl(mapConfig.geolocateControl), 'top-right');

  //===============================================================================================

  console.log('Viewport:', window.innerWidth + ' x ' + window.innerHeight);

  //===============================================================================================
  // Pin Events
  map.on('mouseenter', 'pin-layer', (e) => {
    map.getCanvas().style.cursor = 'pointer';
    const feature = e.features?.[0];
    const { id, title } = feature?.properties || {};
    const coordinates = feature.geometry.coordinates;

    setCurrentTour(id, coordinates);
  });

  map.on('mouseleave', 'pin-layer', () => {
    map.getCanvas().style.cursor = '';
    popup.remove();
  });

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


 
