// route api 이용 시 geocode 와 placeId 구분 목적

function formatGeocode(input: google.maps.LatLngLiteral | string) {
  if (typeof input === 'object') {
    return {
      location: {
        latLng: {
          latitude: input.lat,
          longitude: input.lng,
        },
      },
    };
  }
  if (typeof input === 'string') {
    return {
      placeId: input,
    };
  }
  throw new Error('Invalid location format');
}

export default formatGeocode;
