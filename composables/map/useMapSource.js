import mapConfig from '@/assets/map/map-config.json';
import Bugsnag from '@bugsnag/js';

function safeAddLayer(map, layer) {
    if (!map.getLayer(layer.id)) map.addLayer(layer);
}

export function useMapSource(map, mapAssets) {
    if (!mapAssets) {
      Bugsnag.notify(new Error('MapAssets is undefined, loading default pin and cluster shapes'), event => {
        event.severity = 'warning';
        event.context = 'useMapSource';
      });
      mapAssets = {};
    }
    const cluster_lvl_1 = mapAssets.cluster_lvl_1 || false;
    const cluster_lvl_2 = mapAssets.cluster_lvl_2 || false;
    const pin = mapAssets.pin || false;
    
    if (!map.getSource('points')) map.addSource('points', mapConfig.mapSource);
    safeAddLayer(map, (cluster_lvl_1 && cluster_lvl_2) ? mapConfig.clusterLayers.clusters : mapConfig.clusterLayers.clustersDefault);
    safeAddLayer(map, mapConfig.clusterLayers.clusterCount);
    safeAddLayer(map, pin ? mapConfig.pinLayer : mapConfig.pinLayerDefault);
}