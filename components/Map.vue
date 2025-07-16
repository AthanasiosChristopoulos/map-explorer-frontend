<template>
    <div id="map" class="map-container"></div>
</template>


<script setup lang="ts">
import { ref, onMounted  } from 'vue'
import mapboxgl from 'mapbox-gl'
import pin_image from '@/assets/icons/map-pin-fill.png';

let map: mapboxgl.Map;
let popup: mapboxgl.Popup;

const geoData = ref({});

onMounted(async() => {
  const res = await fetch('http://localhost:5001/data')
    .then(response => response.json())
    .then(data => {
        geoData.value = data;
    });

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

  map.on('load', async () => {
    try {
      const response = await fetch(pin_image);
      const blob = await response.blob();

      const imageBitmap = await createImageBitmap(blob);

      map.addImage('custom-pin', imageBitmap);

      map.addSource('points', { type: 'geojson', data: geoData.value });

      map.addLayer({
        id: 'pin-layer',
        type: 'symbol',
        source: 'points',
        layout: {
          'icon-image': 'custom-pin',
          'icon-size': 0.75,
          'icon-anchor': 'bottom',
          'icon-allow-overlap': true,
        }
      });
    } catch (err) {
      console.error('Error loading custom pin:', err);
    }
  });
    
  popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
    offset: 25           // little gap above the marker
  }).setHTML(`
      <div class="tooltip-title">
        <h3>TourTitle</h3>
      </div>
      <p>This is your tooltip content</p>
    `);

  //===============================================================================================
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


 
