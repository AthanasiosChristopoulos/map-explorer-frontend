import { filters } from '@/composables/useMapFilters.js';

import { ref } from 'vue';

let filteredGeoData = ref({});

export function updateGeoData(map, geoData) {
    let bounds = map.getBounds();

    filteredGeoData.value = {
        type: "FeatureCollection",
        features: geoData.features.filter(data => {
            let filterBounds = false;
            let isIndoorsFilter = false;

            let lng = data.geometry.coordinates[0];
            let lat = data.geometry.coordinates[1];
            if( bounds.getWest() < lng && bounds.getEast() > lng) {
                if(bounds.getSouth() < lat && bounds.getNorth() > lat) {
                    filterBounds = true;
                }
            }
            
            if(filters.value.isIndoors !== null) {
                if (filters.value.isIndoors === data.properties.isIndoors) {
                    isIndoorsFilter = true;
                }

            } else {
                isIndoorsFilter = true;
            }
            if (filterBounds && isIndoorsFilter) {
                return true;
            }
            return false;
        })
    }

    const source = map.getSource('points');
    if (source) {
        source.setData(filteredGeoData.value);
    }
    return {filteredGeoData}
}