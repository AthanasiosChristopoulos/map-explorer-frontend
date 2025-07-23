import mapboxgl from 'mapbox-gl'
import mapConfig from '@/assets/map/map-config.json';
import { isMobile } from '@/utils/devices.js';

let popup;

export function useTooltip(tours, map) {

    popup = new mapboxgl.Popup(mapConfig.popup).setHTML(`
        <div class="tooltip-title">
            <h3>TourTitle</h3>
        </div>
    `);

    function setCurrentTour(id, lngLat) {
        const tour = tours.value.find(t => String(t.id) === String(id));

        popup.setHTML(`
            <div class="tooltip-title">
            <h3>${tour.title}</h3>
            </div>
        `).addTo(map).setLngLat(lngLat);
    };

    if (!isMobile) {
        map.on('mouseenter', 'pin-layer', (e) => {
            const feature = e.features?.[0];
            const { id, title } = feature?.properties || {};
            const coordinates = feature.geometry.coordinates;
            setCurrentTour(id, coordinates);
        });

        map.on('mouseleave', 'pin-layer', () => {
            popup.remove();
        });
    } else {
        console.log('Its not mobile')
        map.on('mouseenter', 'pin-layer', (e) => {
            const feature = e.features?.[0];
            const { id, title } = feature?.properties || {};
            const coordinates = feature.geometry.coordinates;
            setCurrentTour(id, coordinates);
        });
    }

    
    return { setCurrentTour };
}
