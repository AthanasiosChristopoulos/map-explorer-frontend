import Bugsnag from '@bugsnag/js';

export function usePinHighlight(map, id) {
    try {
        map.setLayoutProperty('pin-layer', 'icon-image', [
            'match',
            ['get', 'id'],
            id, 'custom-pin-hover',
            'custom-pin'
        ]);
    } catch(err) {
        Bugsnag.notify(new Error('Icon Image not added to pin layer.'), event => {
            event.severity = 'warning';
            event.context = 'usePinHighlight';
        });
    }
}