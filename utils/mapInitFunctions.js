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

export function loadAndAddImage(map, id, url) {
    return new Promise((resolve) => {
        let img = new Image();
        img.onload = () => {
            map.addImage(id, img);
            resolve(true);
        };
        img.onerror = () => {
            console.log(`Failed to load image '${id}' from '${url}'. Show default config.`);
            resolve(false);
        };
        img.src = url;
    });
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

