import mapboxgl from 'mapbox-gl'
import mapConfig from '@/assets/map/map-config.json';

let popup;

export function useTooltip(tours, map) {

    popup = new mapboxgl.Popup(mapConfig.popup).setHTML(`
        <div class="tooltip-title">
            <h3>TourTitle</h3>
        </div>
        <p>This is your tooltip content</p>
    `);

    function setCurrentTour(id, lngLat) {
        const tour = tours.value.find(t => String(t.id) === String(id));

        popup.setHTML(`
            <div class="tooltip-title">
            <h3>${tour.title}</h3>
            </div>
            <p>This is your tooltip content</p>
        `).addTo(map).setLngLat(lngLat);
    };

    map.on('mouseenter', 'pin-layer', (e) => {
        map.getCanvas().style.cursor = 'pointer';
        const feature = e.features?.[0];
        const { id, title } = feature?.properties || {};
        const coordinates = feature.geometry.coordinates;
        setCurrentTour(id, coordinates);
    });

    map.on('mouseleave', 'pin-layer', () => {
        map.getCanvas().style.cursor = '';
        popup.remove();
    });
    
    return { setCurrentTour };
}
