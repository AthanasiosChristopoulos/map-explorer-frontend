import { createApp, h, onUnmounted } from 'vue'
import AnimatedPopup from 'mapbox-gl-animated-popup'
import MapToolTip from '@/components/MapToolTip.vue'
import mapConfig from '@/assets/map/map-config.json'

export function usePopup(map, tours, findTours) {
    let popup;
    let app;
    let currentId = -1;
    let popupExitAnimation = 200;

    // openTooltip ============================================================================================
    const openTooltip = (id, lngLat) => {
        const tour = tours.value.find(t => String(t.id) === String(id));
        if (!tour) return;

        if (popup?.isOpen() && currentId === id) return;

        currentId = id;
        popupExitAnimation = 200;

        const container = document.createElement('div');
        app = createApp({
        render: () => h(MapToolTip, {
            tour,
            onOpenMappopup: () => {
                popupExitAnimation = 0;
                findTours(tour.id);
                // closePopup();
            }
        })
        });
        app.mount(container);
        try {
            popup.setLngLat(lngLat).setDOMContent(container).addTo(map);
        } catch (err) {
            console.error('Failed to add popup:', err);
        }
    };

    // closeTooltip ============================================================================================
    const closeTooltip = () => {
        if (popup.isOpen()) {
            popup.options.closingAnimation.duration = popupExitAnimation;
            popup.remove();
            setTimeout(() => { app?.unmount(); }, popupExitAnimation);
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

    onUnmounted(closeTooltip);

    return { openTooltip, closeTooltip, getCurrentId: () => currentId, setExitAnimation: val => popupExitAnimation = val };
}
