import { createApp, h } from 'vue'
import mapboxgl from 'mapbox-gl';
import mapConfig from '@/assets/map/map-config.json';
import { isMobile } from '@/utils/devices.js';
import MapToolTip from '@/components/MapToolTip.vue'

let popup;

export function closeTooltip() {
    popup.remove();
}

export function useTooltip(tours, map, findTours) {

    popup = new mapboxgl.Popup(mapConfig.popup);

    function setCurrentTour(id, lngLat) {
        const tour = tours.value.find(t => String(t.id) === String(id));
        if (!tour) {
            console.log('Error, tour not found');
            return;
        }

        const container = document.createElement('div');
        createApp({
            render: () => h(MapToolTip, {
                tour: tour,
                onOpenMappopup: () => {
                    findTours(tour.id);
                    closeTooltip();
                }
            })
        }).mount(container);
            
        popup
            .setDOMContent(container)   // instead of setHTML()
            .addTo(map)
            .setLngLat(lngLat);
    };


    if (!isMobile()) {
        map.on('mouseenter', 'pin-layer', (e) => {
            const feature = e.features?.[0];
            const { id } = feature?.properties || {};
            
            const coordinates = feature.geometry.coordinates;
            setCurrentTour(id, coordinates);
        });

        // map.on('mouseleave', 'pin-layer', () => {
        //     popup.remove();
        // });

    } else {
        map.on('click', 'pin-layer', (e) => {
            const feature = e.features?.[0];
            const { id } = feature?.properties || {};
            findTours(id);  
        });
    }
}
