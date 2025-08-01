export function usePinHighlight(map, id) {
    map.setLayoutProperty('pin-layer', 'icon-image', [
        'match',
        ['get', 'id'],
        id, 'custom-pin-hover',
        'custom-pin'
    ]);
}