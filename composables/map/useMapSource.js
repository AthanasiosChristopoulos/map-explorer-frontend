// composables/useMapSource.js
import mapConfig from '@/assets/map/map-config.json';

function safeAddLayer(map, layer) {
    if (!map.getLayer(layer.id)) map.addLayer(layer);
}

export function useMapSource(map, mapAssets) {

    if (!map.getSource('points')) map.addSource('points', mapConfig.mapSource);
    safeAddLayer(map, (mapAssets.cluster_lvl_1 && mapAssets.cluster_lvl_2) ? mapConfig.clusterLayers.clusters : mapConfig.clusterLayers.clustersDefault);
    safeAddLayer(map, mapConfig.clusterLayers.clusterCount);
    safeAddLayer(map, mapAssets.pin ? mapConfig.pinLayer : mapConfig.pinLayerDefault);
}
