import { onUnmounted, ref } from 'vue';
import mapboxgl from 'mapbox-gl';
import pin_image from '@/assets/icons/map-pin-fill.png';
import cluster_image_0 from '@/assets/icons/cluster-icon-2.png';
import cluster_image_1 from '@/assets/icons/cluster-icon-3.png';
import cluster_image_2 from '@/assets/icons/cluster-icon.png';
import cluster_image_3 from '@/assets/icons/cluster-icon-1.png';

import { useRuntimeConfig } from '#app';
import mapConfig from '@/assets/map/map-config.json';
import { toGeoJSON } from '@/utils/toGeoJSON';
import tour_data from '@/assets/data/tour_data.json';
import { updateGeoData } from '@/composables/updateGeoData.js';

function debounce(func, timeout = 200) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), timeout);
  };
}

export let map;
export let geoData = ref({});

export function useMapInitializer() {
    async function loadAndAddImage(map, id, url) {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const imageBitmap = await createImageBitmap(blob);
            map.addImage(id, imageBitmap);
            return true;
        } catch (err) {
            console.log(`Failed to load image '${id}' from '${url}'. Show default config.`)
            return false;
        }
    }

    const config = useRuntimeConfig();
    geoData.value = toGeoJSON(tour_data);

    mapboxgl.accessToken = config.public.MAPBOX_ACCESS_TOKEN;
    map = new mapboxgl.Map(mapConfig.map);

    // Add events ============================================================================================================

    const handleLoad = async () => {
        try {
            const useCostumPin = await loadAndAddImage(map, 'custom-pin', pin_image);
            const useCostumCluster1 = await loadAndAddImage(map, 'custom-cluster-1', cluster_image_1);
            const useCostumCluster2 = await loadAndAddImage(map, 'custom-cluster-2', cluster_image_2);

            const { filteredGeoData } = updateGeoData();

            map.addSource('points', {
                type: 'geojson',
                data: filteredGeoData.value,
                cluster: true,
                clusterRadius: 50
            });

            map.addLayer((useCostumCluster1 && useCostumCluster2) ? mapConfig.clusterLayers.clusters : mapConfig.clusterLayers.clustersDefault);
            map.addLayer(mapConfig.clusterLayers.clusterCount);
            map.addLayer(useCostumPin ? mapConfig.pinLayer : mapConfig.pinLayerDefault);

        } catch (err) {
            console.error('Error during map load:', err);
        }
    };

    const debouncedUpdate = debounce(updateGeoData);

    map.on('load', handleLoad);
    map.on('move', debouncedUpdate);
    // map.on('zoom', () => {
    //     console.log('Zoom level:', map.getZoom());
    // });

    onUnmounted(() => {
        map.off('load', handleLoad);
        map.off('move', debouncedUpdate);
    });
 
    // Add Interactions ============================================================================================================

    function handleClusterClick(e) {
        const features = map.queryRenderedFeatures(e.point, {
            layers: ['clusters']
        });
        const clusterId = features[0].properties.cluster_id;
        const source = map.getSource('points');

        source.getClusterLeaves(clusterId, Infinity, 0, (err, leaves) => {
            if (err) return;

            const bounds = new (mapboxgl.LngLatBounds)();
            const coordinates = leaves.map(f => f.geometry.coordinates);
            coordinates.forEach(function (coordinate) {
                bounds.extend(coordinate);
            });

            const paddingDegrees = 1; 
            const sw = bounds.getSouthWest();
            const ne = bounds.getNorthEast();
            const paddedBounds = new mapboxgl.LngLatBounds(
                [sw.lng - paddingDegrees, sw.lat - paddingDegrees],
                [ne.lng + paddingDegrees, ne.lat + paddingDegrees]
            );

            map.fitBounds(paddedBounds, {
                padding: 0,
                duration: 1500,
                maxZoom: 18  
            });
        });
    }

    map.addInteraction('click-clusters', {
        type: 'click',
        target: { layerId: 'clusters' },
        handler: handleClusterClick
    });
    map.addInteraction('clusters-mouseenter', {
        type: 'mouseenter',
        target: { layerId: 'clusters' },
        handler: () => {map.getCanvas().style.cursor = 'pointer';}
    });
    map.addInteraction('clusters-mouseleave', {
        type: 'mouseleave',
        target: { layerId: 'clusters' },
        handler: () => {map.getCanvas().style.cursor = '';}
    });

    // Add map controls ============================================================================================================

    map.addControl(new mapboxgl.FullscreenControl(), 'top-right');
    map.addControl(
        new mapboxgl.NavigationControl(mapConfig.controls.navigation),
        'top-right'
    );
    map.addControl(new mapboxgl.GeolocateControl(mapConfig.geolocateControl), 'top-right');

    return { map, geoData };
}
