
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
          location: undefined
      }
    }))
  };

  return geoJSON;
  
}