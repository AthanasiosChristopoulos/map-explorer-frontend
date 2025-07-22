import { onUnmounted, ref } from 'vue';
import mapboxgl from 'mapbox-gl'
import pin_image from '@/assets/icons/map-pin-fill.png';
import { useRuntimeConfig } from '#app';
import mapConfig from '@/assets/map/map-config.json';
import { toGeoJSON } from '@/utils/toGeoJSON';
import tour_data from '@/assets/data/tour_data.json';

let map;
let geoData = ref({});
let filteredGeoData = ref({});

function debounce(func, timeout = 200){
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), timeout);
    };
};

export function useMapInitializer() {
    
    function updateGeoData() {
        let bounds = map.getBounds();

        filteredGeoData.value = {
            type: "FeatureCollection",
            features: geoData.value.features.filter(data => {
                let lng = data.geometry.coordinates[0];
                let lat = data.geometry.coordinates[1];
                if( bounds.getWest() < lng && bounds.getEast() > lng) {
                    if(bounds.getSouth() < lat && bounds.getNorth() > lat) {
                        return true;
                    }
                }
                return false;
            })
        }
        const source = map.getSource('points');
        if (source) {
            source.setData(filteredGeoData.value);
        }
    }

    const config = useRuntimeConfig();

    geoData.value = toGeoJSON(tour_data); // conversion from .json to .geojson

    mapboxgl.accessToken = config.public.MAPBOX_ACCESS_TOKEN;
    map = new mapboxgl.Map(mapConfig.map);
    
    //===============================================================================================
    // Events:
    const loadEvent = async () => {
        let useImage = false;
        try {
            const response = await fetch(pin_image);
            const blob = await response.blob();
            const imageBitmap = await createImageBitmap(blob);

            map.addImage('custom-pin', imageBitmap);
            useImage = true;
        } catch (err) {
            console.error('Error loading custom pin:', err);
            console.log('The default pins are going to be shown instead');
        }
        updateGeoData();
        map.addSource('points', { type: 'geojson', data: filteredGeoData.value });
        map.addLayer(useImage ? mapConfig.pinLayerWithImage : mapConfig.pinLayerDefault);
    };

    const debouncedUpdate = debounce(updateGeoData)

    map.on('load', loadEvent);
    map.on('move', debouncedUpdate);

    onUnmounted(() => {
        map.off('load', loadEvent);
        map.off('move', debouncedUpdate);
    });

    //===============================================================================================
    // Control:

    map.addControl(new mapboxgl.FullscreenControl(), 'top-right');
    map.addControl(
        new mapboxgl.NavigationControl(mapConfig.controls.navigation),
        'top-right'
    );
    map.addControl(new mapboxgl.GeolocateControl(mapConfig.geolocateControl), 'top-right');

    return {map, geoData}
}

