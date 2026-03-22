import { onUnmounted } from 'vue';
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

    const dragstartHandler = () => {
        map.getCanvasContainer().dispatchEvent(new MouseEvent('click', { bubbles: true }));
    };

    map.on('move', debouncedUpdate);
    map.on('mousemove', mousemoveHandler);
    map.on('zoomend', zoomendHandler);
    map.on('click', 'clusters', clusterClickHandler);
    // fire a fake click on the map container (for popover element which rely on click events (click outside)
    map.on('dragstart', dragstartHandler);

    updateGeoData(map, geoData);
    return () => {
        map.off('move', debouncedUpdate);
        map.off('mousemove', mousemoveHandler);
        map.off('zoomend', zoomendHandler);
        map.off('click', 'clusters', clusterClickHandler);
        map.off('dragstart', dragstartHandler);
    };
}
