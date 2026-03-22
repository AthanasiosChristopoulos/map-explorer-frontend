import mapboxgl from 'mapbox-gl';

import { useRuntimeConfig } from '#app';
import mapConfig from '@/assets/map/map-config.json';
import { toGeoJSON, validatorGeoJSON } from '@/utils/toGeoJSON';
import tour_data from '@/assets/data/tour_data.json';
import { useTooltip } from '@/composables/useTooltip.js'

import { useMapAssets } from '@/composables/map/useMapAssets.js'
import { useMapSource } from '@/composables/map/useMapSource.js'
import { useMapControls } from '@/composables/map/useMapControls.js'
import { useMapEvents } from '@/composables/map/useMapEvents.js'

import Bugsnag from '@bugsnag/js';

export function useMapInitializer(tours, findTours, onClusterClickClosePopup) { // callback function.
    let map;
    let geoData = toGeoJSON(tour_data);
 
    if (!validatorGeoJSON(geoData)) {
        Bugsnag.notify(new Error("Invalid GeoJSON input"), event => {
            event.severity = "error";
            event.context = "useMapInitializer";
        });
    }
    const config = useRuntimeConfig();
    let closeTooltip = null;

    mapboxgl.accessToken = config.public.MAPBOX_ACCESS_TOKEN;
    map = new mapboxgl.Map(mapConfig.map);
    const { control } = useMapControls(map);
    let cleanupMapEvents;

    map.on('load', async() => {
        try {
            const mapAssets = await useMapAssets(map);
            useMapSource(map, mapAssets);
            cleanupMapEvents = useMapEvents(map, geoData, closeTooltip, onClusterClickClosePopup);

        } catch (err) {
            console.error('Error during map load:', err);
            Bugsnag.notify(new Error('Failed to load map'), event => {
                event.severity = 'error';
                event.context = 'useMapInitializer'; 
            });
        }
    });

    onUnmounted(() => {if(cleanupMapEvents) cleanupMapEvents();});

    closeTooltip = useTooltip(tours, map, findTours);
    return { map, geoData, closeTooltip, control };
}
