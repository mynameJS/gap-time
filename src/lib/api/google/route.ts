import { PolylineStep } from '@/types/interface';

type RouteResult = {
  distance: number;
  duration: string;
  steps: PolylineStep[];
};

export async function fetchRoute(
  origin: google.maps.LatLngLiteral | string,
  destination: google.maps.LatLngLiteral | string,
  mode: string,
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
    return data as RouteResult; // 안전하게 타입 명시
  } catch (err) {
    console.error('💥 요청 실패:', err);
    return null;
  }
}
