import { createApp, h, ref } from 'vue'
import mapboxgl from 'mapbox-gl';
import mapConfig from '@/assets/map/map-config.json';
import { isMobile } from '@/utils/devices.js';
import MapToolTip from '@/components/MapToolTip.vue'

let popup;
let mapRef = ref(null); 
let current_popup_id = -1;

export function closeTooltip() {
    popup.remove();
}

export function changePinIcon(id) {
    if (!mapRef) {
        console.error("Map instance is not set.");
        return;
    }
    mapRef.setLayoutProperty('pin-layer', 'icon-image',
        [
        'match',
        ['get', 'id'],
        id, 'custom-pin-hover',
        'custom-pin' 
        ]
    )
}

export function useTooltip(tours, map, findTours) {
    mapRef = map; 

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
            .setLngLat(lngLat)
            .setDOMContent(container)   // instead of setHTML()
            .addTo(map);
    };

    if (!isMobile()) {
        map.on('click', 'pin-layer', (e) => {
            const feature = e.features?.[0];
            const { id } = feature?.properties || {};
            current_popup_id = id;
            const coordinates = feature.geometry.coordinates;
            setCurrentTour(id, coordinates);
            changePinIcon(id);
        });

        // map.on('mouseleave', 'pin-layer', () => {
        //     popup.remove();
        // });
        map.on('click', (e) => {
            const features = map.queryRenderedFeatures(e.point, {layers: ['pin-layer']});

            if (features.length === 0 || features[0].properties?.id !== current_popup_id) {
                closeTooltip();
                changePinIcon(-1);  
            }
        });

    } else {
        map.on('click', 'pin-layer', (e) => {
            const feature = e.features?.[0];
            const { id } = feature?.properties || {};
            findTours(id);  
            changePinIcon(id);
        });
    }
}
