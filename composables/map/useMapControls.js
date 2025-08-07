import mapboxgl from 'mapbox-gl';
import mapConfig from '@/assets/map/map-config.json';
import { isMobile } from '@/utils/devices';

export function useMapControls(map) {
  if (isMobile()) return;

  map.addControl(new mapboxgl.FullscreenControl({ container: document.body }), "top-right");
  map.addControl(new mapboxgl.NavigationControl(mapConfig.controls.navigation), "top-right");
  map.addControl(new mapboxgl.GeolocateControl(mapConfig.geolocateControl), "top-right");
}