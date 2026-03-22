import { isMobile } from '@/utils/devices'
import { usePinHighlight } from '@/composables/tooltip/usePinHighlight'

export function useMapInteractions(map, openTooltip, closeTooltip, getCurrentId, setExitAnimation, findTours) {

  const handlePinClick = (e) => {
      const feature = e.features?.[0];
      const id = feature?.properties?.id;
      if (!id) return;
      const lngLat = feature.geometry.coordinates;
      openTooltip(id, lngLat);
      usePinHighlight(map, id);
  };

  const handleMapClick = (e) => {
      if (e.type === 'dragstart') setExitAnimation(0);
      const features = map.queryRenderedFeatures(e.point, { layers: ['pin-layer'] });
      if (!features.length || features[0].properties?.id !== getCurrentId()) {
        closeTooltip();
        usePinHighlight(map, -1);
        setExitAnimation(200);
      }
  };

  const handleMobilePinClick = (e) => {
      const feature = e.features?.[0];
      const id = feature?.properties?.id;
      if (id) {
        findTours(id);
        usePinHighlight(map, id);
      }
  };

  if (!isMobile()) {
      map.on('click', 'pin-layer', handlePinClick);
      map.on('click', handleMapClick);
      map.on('dragstart', handleMapClick);
  } else {
      map.on('click', 'pin-layer', handleMobilePinClick);
  }

  onUnmounted(() => {
      map.off('click', 'pin-layer', handlePinClick);
      map.off('click', 'pin-layer', handleMobilePinClick);
      map.off('click', handleMapClick);
      map.off('dragstart', handleMapClick);
  });
}
