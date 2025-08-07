
import { updateGeoData } from '@/composables/updateGeoData.js';
import { debounce, updateCursorAtPoint, handleClusterClick } from '@/utils/mapInitFunctions.js';

export function useMapEvents(map, geoData, closeTooltip, onClusterClickClosePopup) {
    let lastMouseEvent = null;
    const debouncedUpdate = debounce(() => { updateGeoData(map, geoData) });

    const mousemoveHandler = (e) => {
        lastMouseEvent = e;
        updateCursorAtPoint(map, e.point);
    };

    const zoomendHandler = () => {
        if (lastMouseEvent) updateCursorAtPoint(map, lastMouseEvent.point);
    };

    const clusterClickHandler = (e) => {
        closeTooltip();
        handleClusterClick(map, e);
        if (onClusterClickClosePopup) onClusterClickClosePopup();
    };

    map.on('move', debouncedUpdate);
    map.on('mousemove', mousemoveHandler);
    map.on('zoomend', zoomendHandler);
    map.on('click', 'clusters', clusterClickHandler);
    updateGeoData(map, geoData);
}
