import mapboxgl from 'mapbox-gl';
import mapConfig from '@/assets/map/map-config.json';
import { isMobile } from '@/utils/devices';


export function useMapControls(map) {
  if (!isMobile()) map.addControl(new mapboxgl.FullscreenControl({ container: document.body }), "top-right");
  let control = new mapboxgl.NavigationControl(mapConfig.controls.navigation);
  map.addControl(control, "top-right");
  if (!isMobile()) map.addControl(new mapboxgl.GeolocateControl(mapConfig.geolocateControl), "top-right");

  return { control }
}

export function showControl(map, control) {
  map.addControl(control, "top-right");
}

export function hideControl(map, control) {
  map.removeControl(control);
}