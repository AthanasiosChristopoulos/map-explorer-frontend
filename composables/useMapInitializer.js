import { onUnmounted, ref } from 'vue';
import mapboxgl from 'mapbox-gl';
// import pin_image from '@/assets/icons/map-pin-fill.svg';

import { useRuntimeConfig } from '#app';
import mapConfig from '@/assets/map/map-config.json';
import { toGeoJSON } from '@/utils/toGeoJSON';
import tour_data from '@/assets/data/tour_data.json';
import { useTooltip } from '@/composables/useTooltip.js'

import { useMapAssets } from '@/composables/map/useMapAssets.js'
import { useMapSource } from '@/composables/map/useMapSource.js'
import { useMapControls } from '@/composables/map/useMapControls.js'
import { useMapEvents } from '@/composables/map/useMapEvents.js'

export function useMapInitializer(tours, findTours, onClusterClickClosePopup) { // callback function.
    let map;
    let geoData = toGeoJSON(tour_data);
    const config = useRuntimeConfig();
    let closeTooltip = null;

    mapboxgl.accessToken = config.public.MAPBOX_ACCESS_TOKEN;
    map = new mapboxgl.Map(mapConfig.map);

    map.on('load', async() => {
        try {
            const mapAssets = await useMapAssets(map);
            useMapSource(map, mapAssets);
            useMapControls(map);
            useMapEvents(map, geoData, closeTooltip, onClusterClickClosePopup);
        } catch (err) {
            console.error('Error during map load:', err);
        }
    });

    closeTooltip = useTooltip(tours, map, findTours);
    return { map, geoData, closeTooltip };
}
