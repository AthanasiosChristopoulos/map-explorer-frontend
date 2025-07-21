import { ref } from 'vue';
import mapboxgl from 'mapbox-gl'
import pin_image from '@/assets/icons/map-pin-fill.png';
import { useRuntimeConfig } from '#app';
import mapConfig from '@/assets/map/map-config.json';
import { toGeoJSON } from '@/utils/toGeoJSON';
import tour_data from '@/assets/data/tour_data.json';
import { updateGeoData } from '@/composables/updateGeoData.js';

export let map;
export let geoData = ref({});
let interval;

export function useMapInitializer() {
    
    const config = useRuntimeConfig();

    geoData.value = toGeoJSON(tour_data); // conversion from .json to .geojson

    mapboxgl.accessToken = config.public.MAPBOX_ACCESS_TOKEN;

    map = new mapboxgl.Map(mapConfig.map);

    map.on('load', async () => {
            try {
            
            const response = await fetch(pin_image);
            const blob = await response.blob();
            const imageBitmap = await createImageBitmap(blob);

            map.addImage('custom-pin', imageBitmap);

            const { filteredGeoData } = updateGeoData();

            map.addSource('points', { type: 'geojson', data: filteredGeoData.value, cluster: true });

            // map.addLayer(mapConfig.pinLayer);
            map.addLayer({
                id: 'clusters',
                type: 'circle',
                source: 'points',
                filter: ['has', 'point_count'],
                paint: {
                    'circle-color': [
                        'step',
                        ['get', 'point_count'],
                        '#F9EDEF',
                        5,
                        '#EAA2A8',
                        10,
                        '#FD907E'
                    ],
                    'circle-radius': [
                        'step',
                        ['get', 'point_count'],
                        30,
                        100,
                        50,
                        750,
                        70
                    ],
                    'circle-emissive-strength': 1
                }
            });

            map.addLayer({
                id: 'cluster-count',
                type: 'symbol',
                source: 'points',
                filter: ['has', 'point_count'],
                layout: {
                    'text-field': ['get', 'point_count_abbreviated'],
                    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                    'text-size': 12
                }
            });

            map.addLayer({
                id: 'unclustered-point',
                type: 'circle',
                source: 'points',
                filter: ['!', ['has', 'point_count']],
                paint: {
                    'circle-color': '#D54552',
                    'circle-radius': 8,
                    'circle-stroke-width': 1,
                    'circle-stroke-color': '#fff',
                    'circle-emissive-strength': 1
                }
            });
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

