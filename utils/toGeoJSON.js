
export function toGeoJSON(tours) {
  
  const geoJSON = {
    type: "FeatureCollection",
    features: tours.map(tour => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: tour.location.coordinates
      },
      properties: {
          ...tour,
          address: tour.location.address,
          location: undefined
      }
    }))
  };

  return geoJSON;
}

export function validatorGeoJSON(geoData) {
    return geoData 
        && geoData.type === "FeatureCollection"
        && Array.isArray(geoData.features)
        && geoData.features.every(f =>
            f.type === "Feature" &&
            f.geometry &&
            f.properties && 
            Array.isArray(f.geometry.coordinates) &&
            f.geometry.coordinates.length >= 2
        );
  }