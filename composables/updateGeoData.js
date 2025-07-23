import { ref } from 'vue';

let filteredGeoData = ref({});

export function updateGeoData(map, geoData) {

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

    map.getSource('points')?.setData(filteredGeoData.value);

    return { filteredGeoData }
}