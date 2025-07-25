import { onUnmounted, ref } from 'vue';
import mapboxgl from 'mapbox-gl';
// import pin_image from '@/assets/icons/map-pin-fill.svg';
import pin_image from '@/assets/icons/map-pin-figma.svg';
import pin_image_hover from '@/assets/icons/map-pin-figma-hover.svg';

import cluster_image_2 from '@/assets/icons/cluster/cluster-icon.svg';
import cluster_image_1 from '@/assets/icons/cluster/cluster-icon-3.svg';

import { useRuntimeConfig } from '#app';
import mapConfig from '@/assets/map/map-config.json';
import { toGeoJSON } from '@/utils/toGeoJSON';
import tour_data from '@/assets/data/tour_data.json';
import { updateGeoData } from '@/composables/updateGeoData.js';
import { debounce, updateCursorAtPoint, loadAndAddImage, handleClusterClick } from '@/utils/mapInitFunctions.js';
import { closeTooltip } from '@/composables/useTooltip.js';

import { isMobile } from '../utils/devices';


let map;
let geoData = toGeoJSON(tour_data);
let lastMouseEvent = null;

export function useMapInitializer(onClusterClickClosePopup) { // callback function.

    const config = useRuntimeConfig();

    mapboxgl.accessToken = config.public.MAPBOX_ACCESS_TOKEN;
    map = new mapboxgl.Map(mapConfig.map);

    // Add events ============================================================================================================

    const debouncedUpdate = debounce(() => { updateGeoData(map, geoData) });

    const mousemoveHandler = (e) => {
        lastMouseEvent = e;
        updateCursorAtPoint(map, e.point);
    };
    const zoomendHandler = () => {
        if(lastMouseEvent) {
            updateCursorAtPoint(map, lastMouseEvent.point);
        }
    };

    const handleLoad = async () => {
        try {
            const [useCostumPin, useCostumCluster1, useCostumCluster2] = await Promise.all([
                loadAndAddImage(map, 'custom-pin', pin_image),
                loadAndAddImage(map, 'custom-pin-hover', pin_image_hover),
                loadAndAddImage(map, 'custom-cluster-1', cluster_image_1),
                loadAndAddImage(map, 'custom-cluster-2', cluster_image_2),
            ]);

            map.addSource('points', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: []
                },
                cluster: true,
                clusterRadius: 50
            });

            map.addLayer((useCostumCluster1 && useCostumCluster2) ? mapConfig.clusterLayers.clusters : mapConfig.clusterLayers.clustersDefault);
            map.addLayer(mapConfig.clusterLayers.clusterCount);
            map.addLayer(useCostumPin ? mapConfig.pinLayer : mapConfig.pinLayerDefault);
      
            map.on('move', debouncedUpdate);
            map.on('mousemove', mousemoveHandler);
            map.on('zoomend', zoomendHandler);

            updateGeoData(map, geoData);

        } catch (err) {
            console.error('Error during map load:', err);
        }
    };

    map.on('load', handleLoad);
    map.on('move', debouncedUpdate);    
    
    const clickHandler = (e) => {
        closeTooltip();
        handleClusterClick(map, e);
        if (onClusterClickClosePopup) {
            onClusterClickClosePopup();  
        }
    }
    map.on('click', 'clusters', clickHandler);

    onUnmounted(() => {
        map.off('load', handleLoad);
        map.off('move', debouncedUpdate);
        map.off('mousemove', mousemoveHandler);
        map.off('zoomend', zoomendHandler);
        map.off('click', 'clusters', clickHandler);
    });

    // Add map controls ============================================================================================================

    if(!isMobile()) {
        map.addControl(new mapboxgl.FullscreenControl(), 'top-right');
        map.addControl(
            new mapboxgl.NavigationControl(mapConfig.controls.navigation),
            'top-right'
        );
        map.addControl(new mapboxgl.GeolocateControl(mapConfig.geolocateControl), 'top-right');
    }

    return { map, geoData };
}
