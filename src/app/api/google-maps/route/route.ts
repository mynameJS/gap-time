import { NextRequest, NextResponse } from 'next/server';
import formatGeocode from '@/utils/format/formatGeocode';

export async function POST(req: NextRequest) {
  try {
    const { origin, destination, mode } = await req.json();

    if (!origin || !destination) {
      return NextResponse.json({ error: 'origin과 destination이 필요합니다.' }, { status: 400 });
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!;
    const url = 'https://routes.googleapis.com/directions/v2:computeRoutes';

    const requestBody = {
      origin: formatGeocode(origin),
      destination: formatGeocode(destination),
      travelMode: mode || 'TRANSIT',
      languageCode: 'ko-KR',
      units: 'METRIC',
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data.error?.message || 'Google API 에러' }, { status: res.status });
    }

    const route = data.routes?.[0];

    return NextResponse.json({
      distance: route?.distanceMeters,
      duration: route?.duration,
      polyline: route?.polyline?.encodedPolyline,
    });
  } catch (err) {
    console.error('Route API 오류:', err);
    return NextResponse.json({ error: '서버 오류 발생', details: err }, { status: 500 });
  }
}
