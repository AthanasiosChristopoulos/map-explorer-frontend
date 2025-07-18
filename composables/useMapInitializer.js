import { ref } from 'vue';
import mapboxgl from 'mapbox-gl'
import pin_image from '@/assets/icons/map-pin-fill.png';
import { useRuntimeConfig } from '#app';
import mapConfig from '@/assets/map/map-config.json';
import { toGeoJSON } from '@/utils/toGeoJSON';
import tour_data from '@/assets/data/tour_data.json';

let map;
let geoData = ref({});

export function useMapInitializer() {
    const config = useRuntimeConfig();
    geoData.value = toGeoJSON(tour_data); // conversion from .json to .geojson

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
        
    //===============================================================================================
    // Control:

    map.addControl(new mapboxgl.FullscreenControl(), 'top-right');

    map.addControl(
        new mapboxgl.NavigationControl(mapConfig.controls.navigation),
        'top-right'
    );
    
    map.addControl(new mapboxgl.GeolocateControl(mapConfig.geolocateControl), 'top-right');

    //===============================================================================================
    // Pin Events
    
    return {map, geoData}

}
