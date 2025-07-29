import { createApp, h, ref } from 'vue'
import mapConfig from '@/assets/map/map-config.json';
import { isMobile } from '@/utils/devices.js';
import MapToolTip from '@/components/MapToolTip.vue'
import AnimatedPopup from 'mapbox-gl-animated-popup'

let app;
let popup;
let mapRef = ref(null); 
let popupExitAnimation = 300;

export function closeTooltip() {
    if (popup && popup.isOpen()) {
        popup.options.closingAnimation.duration = popupExitAnimation;
        popup.remove();
        setTimeout(() => {app.unmount();}, popupExitAnimation);
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
    let current_popup_id = -1;
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
        app = createApp({
            render: () => h(MapToolTip, {
                tour: tour,
                onOpenMappopup: () => {
                    findTours(tour.id);
                    closeTooltip();
                }
            })
        })
        
        app.mount(container);
            
        try {
            popup
                .setLngLat(lngLat)
                .setDOMContent(container)  
                .addTo(map);            

        } catch (error) {
            console.error(`Failed to add the popup to the map. ${error}`)
        } 
    };
    function handlePinLayerClick(e) {
        const feature = e.features?.[0];
        const { id } = feature?.properties || {};
        if (popup.isOpen() && current_popup_id === id) return;

        current_popup_id = id;

        const coordinates = feature.geometry.coordinates;
        setCurrentTour(id, coordinates);
        changePinIcon(id);
    }
    function handleInteraction(e) {
        if (e.type === 'dragstart') popupExitAnimation = 0;
        

        const features = map.queryRenderedFeatures(e.point, { layers: ['pin-layer'] });

        if (features.length === 0 || features[0].properties?.id !== current_popup_id) {
            closeTooltip();
            changePinIcon(-1);
            popupExitAnimation = 200;
        }
    }

    function handlePinLayerClickOnMobile(e) {
        const feature = e.features?.[0];
        const { id } = feature?.properties || {};
        findTours(id);  
        changePinIcon(id);
    }

    if (!isMobile()) {
        map.on('click', 'pin-layer', handlePinLayerClick);
        map.on('dragstart', handleInteraction);
        map.on('click', handleInteraction);


    } else {
        map.on('click', 'pin-layer', handlePinLayerClickOnMobile);
    }
    onUnmounted(() => {
        map.off('click', 'pin-layer', handlePinLayerClickOnMobile);
        map.off('click', 'pin-layer', handlePinLayerClick);
        map.off('click', handleInteraction);
        map.off('dragstart', handleInteraction);

    })
}
