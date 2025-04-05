type RouteResult = {
  distance: number; // 미터 단위
  duration: string; // "1234s"
  polyline: string; // 인코딩된 경로
};

export async function fetchRoute(
  origin: google.maps.LatLngLiteral | string,
  destination: google.maps.LatLngLiteral | string,
  mode: string
): Promise<RouteResult | null> {
  try {
    const res = await fetch('/api/google-maps/route', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ origin, destination, mode }),
    });

    if (!res.ok) {
      console.error('🧨 Google API 실패:', await res.json());
      return null;
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error('💥 요청 실패:', err);
    return null;
  }
}
