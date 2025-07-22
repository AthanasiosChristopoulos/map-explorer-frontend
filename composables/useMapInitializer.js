import { onUnmounted, ref } from 'vue';
import mapboxgl from 'mapbox-gl'
import pin_image from '@/assets/icons/map-pin-fill.png';
import cluster_image_0 from '@/assets/icons/cluster-icon.png';
import cluster_image_1 from '@/assets/icons/cluster-icon-1.png';
import cluster_image_2 from '@/assets/icons/cluster-icon-2.png';
import cluster_image_3 from '@/assets/icons/cluster-icon-3.png';

import { useRuntimeConfig } from '#app';
import mapConfig from '@/assets/map/map-config.json';
import { toGeoJSON } from '@/utils/toGeoJSON';
import tour_data from '@/assets/data/tour_data.json';
import { updateGeoData } from '@/composables/updateGeoData.js';
function debounce(func, timeout = 200){
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), timeout);
    };
};

export let map;
export let geoData = ref({});

export function useMapInitializer() {
    async function loadAndAddImage(map, id, url) {
        const response = await fetch(url);
        const blob = await response.blob();
        const imageBitmap = await createImageBitmap(blob);
        map.addImage(id, imageBitmap);
    }

    const config = useRuntimeConfig();

    geoData.value = toGeoJSON(tour_data); // conversion from .json to .geojson

    mapboxgl.accessToken = config.public.MAPBOX_ACCESS_TOKEN;
    map = new mapboxgl.Map(mapConfig.map);

    map.on('load', async () => {
            try {          
                await loadAndAddImage(map, 'custom-pin', pin_image);
                await loadAndAddImage(map, 'custom-cluster-1', cluster_image_3);
                await loadAndAddImage(map, 'custom-cluster-2', cluster_image_0);

                const { filteredGeoData } = updateGeoData();

                map.addSource('points', { type: 'geojson', data: filteredGeoData.value, cluster: true });

                // map.addLayer(mapConfig.pinLayer);
                map.addLayer(mapConfig.clusterLayers.clusters);
                map.addLayer(mapConfig.clusterLayers.clusterCount);
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

    map.on('moveend', () =>{   
        if (interval) clearInterval(interval);
        updateGeoData();
    });

    map.on('dragstart', () => {
        interval = setInterval(() => {
            updateGeoData();
        }, 500);
    });

    return {map, geoData}
}

