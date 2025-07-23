import mapboxgl from 'mapbox-gl';


export function debounce(func, timeout = 200) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), timeout);
  };
}

export function updateCursorAtPoint(map, point) {
    const features = map.queryRenderedFeatures(point, { layers: ['clusters', 'pin-layer'] });
    const isOverFeature = features.length > 0;
    map.getCanvas().style.cursor = isOverFeature ? 'pointer' : '';
}

export async function loadAndAddImage(map, id, url) {
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

export function handleClusterClick(map, e) {
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

