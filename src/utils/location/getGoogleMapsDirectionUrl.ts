const getGoogleMapsDirectionUrl = (
  origin: google.maps.LatLngLiteral,
  destination: google.maps.LatLngLiteral,
  travelMode: 'driving' | 'walking' | 'bicycling' | 'transit' = 'transit'
): string => {
  const originParam = `${origin.lat},${origin.lng}`;
  const destinationParam = `${destination.lat},${destination.lng}`;

  const params = new URLSearchParams({
    origin: originParam,
    destination: destinationParam,
    travelmode: travelMode,
  });

  return `https://www.google.com/maps/dir/?api=1&${params.toString()}`;
};

export default getGoogleMapsDirectionUrl;
