interface fetchOptimizedRouteParams {
  origin: google.maps.LatLngLiteral;
  waypoints: string[]; // place_id 형태
  routeType: string;
}

export async function fetchOptimizedRoute({ origin, waypoints, routeType }: fetchOptimizedRouteParams) {
  const response = await fetch('/api/google-maps/direction', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      origin,
      waypoints,
      routeType,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`API Error: ${error.error || 'Unknown error'}`);
  }

  return response.json();
}
