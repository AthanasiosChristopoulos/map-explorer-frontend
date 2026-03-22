import { filters } from '@/composables/useMapFilters.js';
import { ref } from 'vue';
import Bugsnag from '@bugsnag/js';

let filteredGeoData = ref({});

export function updateGeoData(map, geoData) {
    let bounds = map.getBounds();

    function filterMatch(activeFilters, data, all = false) {
        // No filter applied or invalid data
        if (activeFilters === null || activeFilters === undefined) return true;
        if (data === null || data === undefined) return false;

        // Handle arrays
        if (Array.isArray(data) && Array.isArray(activeFilters)) {
            return all
            ? activeFilters.every(f => data.includes(f))  // must include all
            : activeFilters.some(f => data.includes(f));  // must include at least one
        }

        // Handle primitive comparison if its not an array
        return activeFilters === data;
    }

    filteredGeoData.value = {
        type: "FeatureCollection",
        features: geoData.features.filter(data => {
            let filterBounds = false;
            let languageFilter = false
            let isIndoorsFilter = false;
            let categoryFilter = false
            let countryFilter = false

            let lng = data.geometry.coordinates[0];
            let lat = data.geometry.coordinates[1];
            if( bounds.getWest() < lng && bounds.getEast() > lng) {
                if(bounds.getSouth() < lat && bounds.getNorth() > lat) {
                    filterBounds = true;
                }
            }

            languageFilter = filterMatch(filters.value.languages, data.properties.availableLanguages);
            isIndoorsFilter = filterMatch(filters.value.isIndoors, data.properties.isIndoors);
            categoryFilter = filterMatch(filters.value.categories, data.properties.categories.map(c => c.name), true);
            countryFilter = filterMatch(filters.value.countries, data.properties.country);

            // Final Check if Tour should be filtered out or not =================================
            return filterBounds && languageFilter && isIndoorsFilter && categoryFilter && countryFilter;
        })
    }
    if (filteredGeoData.value.features.length === 0) {
        Bugsnag.notify(new Error('updateGeoData returned no data'), event => {
            event.severity = 'warning';
            event.context = 'updateGeoData';
            event.addMetadata('filters', { filters: filters.value });
        });
    }
    const source = map.getSource('points');
    if (source) {
        source.setData(filteredGeoData.value);
    }
    return {filteredGeoData}
}