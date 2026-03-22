import { createApp, h, onUnmounted } from 'vue'
import AnimatedPopup from 'mapbox-gl-animated-popup'
import MapTooltip from '@/components/MapTooltip.vue'
import mapConfig from '@/assets/map/map-config.json'
import Bugsnag from '@bugsnag/js';

export function usePopup(map, tours, findTours) {
    let popup;
    let app;
    let currentId = -1;

    // Detect reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        if (mapConfig.popup.openingAnimation) mapConfig.popup.openingAnimation.duration = 0   
    }
    let popupExitAnimation;

    // openTooltip ============================================================================================
    
    const openTooltip = (id, lngLat) => {
        const tour = tours.value.find(t => String(t.id) === String(id));
        if (!tour) return;

        if (popup?.isOpen() && currentId === id) return;
        
        currentId = id;
        popupExitAnimation = prefersReducedMotion ? 0 : 200;

        try {
            const container = document.createElement('div');
            app = createApp({
                render: () => h(MapTooltip, {
                    tour,
                    onOpenMappopup: () => {
                        popupExitAnimation = 0;
                        findTours(tour.id);
                        // closePopup();
                    }
                })
            });
            app.mount(container);
            popup.setLngLat(lngLat).setDOMContent(container).addTo(map);

        } catch (err) {
            console.error('Failed to open map popup', err);
            Bugsnag.notify(new Error('Failed to open map popup'), event => {
                event.severity = 'error';
                event.context = 'usePopup';
            });
        }
    };

    // closeTooltip ============================================================================================

    const closeTooltip = (noCloseAnimation = false) => {
        if (popup.isOpen()) {
            if(noCloseAnimation) {
               popup.options.closingAnimation.duration = 0; 
            } else {
                popup.options.closingAnimation.duration = popupExitAnimation;
            }
            try {
                popup.remove();
                setTimeout(() => { app?.unmount(); }, popupExitAnimation);
            } catch(err) {
                console.error('Failed to close tooltip:', err);
                Bugsnag.notify(new Error('Failed to close map popup'), event => {
                    event.severity = 'error';
                    event.context = 'usePopup';
                });
            }
        }
    };

    // create Tooltip ==========================================================================================

    popup = new AnimatedPopup({
        ...mapConfig.popup,
        closingAnimation: {
            duration: popupExitAnimation,
            easing: 'easeInCubic',
            transform: 'scale',
        },
    });

    onUnmounted(() => {closeTooltip();});

    return { openTooltip, closeTooltip, getCurrentId: () => currentId, setExitAnimation: val => popupExitAnimation = val };
}
