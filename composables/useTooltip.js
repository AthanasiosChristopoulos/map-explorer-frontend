import { createApp, h, ref } from 'vue'
import mapboxgl from 'mapbox-gl';
import mapConfig from '@/assets/map/map-config.json';
import { isMobile } from '@/utils/devices.js';
import MapToolTip from '@/components/MapToolTip.vue'
import AnimatedPopup from 'mapbox-gl-animated-popup'

let popup;
let mapRef = ref(null); 
let popupExitAnimation = 300;
let current_popup_id = -1;

export function closeTooltip() {
    if (popup && popup.isOpen()) {
        popup.options.closingAnimation.duration = popupExitAnimation;
        popup.remove();
    }
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
    popup = new AnimatedPopup({
        ...mapConfig.popup,
        closingAnimation: {
            duration: popupExitAnimation,
            easing: "easeInCubic",
            transform: "scale"
        }
    });

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
            if (popup.isOpen() && current_popup_id === id) return;
            current_popup_id = id
            
            const coordinates = feature.geometry.coordinates;
            setCurrentTour(id, coordinates);
            changePinIcon(id);
        });

        // Close Popup on clicking anything else
        map.on('click', handleInteraction);
        map.on('dragstart', (e) => {
            console.log('AAAA')
            popupExitAnimation = 0;
            handleInteraction(e);
        });
        function handleInteraction(e) {
            const features = map.queryRenderedFeatures(e.point, { layers: ['pin-layer'] });

            if (features.length === 0 || features[0].properties?.id !== current_popup_id) {
                closeTooltip();
                changePinIcon(-1);
                popupExitAnimation = 200;
            }
        }

    } else {
        map.on('click', 'pin-layer', (e) => {
            const feature = e.features?.[0];
            const { id } = feature?.properties || {};
            findTours(id);  
            changePinIcon(id);
        });
    }
}
