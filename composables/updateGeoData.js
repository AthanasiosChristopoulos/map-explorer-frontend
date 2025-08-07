import { filters } from '@/composables/useMapFilters.js';
import { ref } from 'vue';

let filteredGeoData = ref({});

export function updateGeoData(map, geoData) {
    let bounds = map.getBounds();

    filteredGeoData.value = {
        type: "FeatureCollection",
        features: geoData.features.filter(data => {
            let filterBounds = false;
            let languageFilter = false
            let isIndoorsFilter = false;
            let categoryFilter = false

            let lng = data.geometry.coordinates[0];
            let lat = data.geometry.coordinates[1];
            if( bounds.getWest() < lng && bounds.getEast() > lng) {
                if(bounds.getSouth() < lat && bounds.getNorth() > lat) {
                    filterBounds = true;
                }
            }
            // languageFilter ===================================================================

             if(filters.value.languages !== null) {
                // Tour must include only one of the selected languages
                for (const language of filters.value.languages) {
                    if (data.properties.availableLanguages.includes(language)) {
                        languageFilter = true;
                        break;
                    }
                }
            } else {
                languageFilter = true;
            }

            // isIndoorsFilter ===================================================================

            if(filters.value.isIndoors !== null) {
                if (filters.value.isIndoors === data.properties.isIndoors) {
                    isIndoorsFilter = true;
                }
            } else {
                isIndoorsFilter = true;
            }

            // categoryFilter ===================================================================

            if (filters.value.categories !== null) {
                // Tour must include all of the selected categories 
                const tourCategoryNames = data.properties.categories.map(c => c.name);
                categoryFilter = filters.value.categories.every(selectedCategory =>
                    tourCategoryNames.includes(selectedCategory)
                );
            } else {
                categoryFilter = true;
            }

            // Final Check if Tour should be filtered out or not =================================

            if (filterBounds && languageFilter && isIndoorsFilter && categoryFilter) {
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