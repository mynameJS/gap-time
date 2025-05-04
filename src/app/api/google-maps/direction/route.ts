import { NextResponse } from 'next/server';

type DirectionRequest = {
  origin: google.maps.LatLngLiteral;
  waypoints: string[];
  routeType: string;
};

export async function POST(req: Request) {
  try {
    const { origin, waypoints, routeType }: DirectionRequest = await req.json();

    if (!origin || !waypoints || !routeType) {
      return NextResponse.json({ error: '필수 정보가 누락되었습니다.' }, { status: 400 });
    }

    const originStr = `${origin.lat},${origin.lng}`;
    const waypointStr = waypoints.map(id => `place_id:${id}`).join('|');
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
    const mode = 'driving';
    const baseUrl = 'https://maps.googleapis.com/maps/api/directions/json';

    const destinationParam = routeType === '왕복' ? `&destination=${originStr}` : '';

    const url = `${baseUrl}?origin=${originStr}&waypoints=optimize:true|${waypointStr}${destinationParam}&mode=${mode}&departure_time=now&key=${apiKey}`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.status !== 'OK') {
      return NextResponse.json({ error: data.status, details: data.error_message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('Google Directions API 오류:', err);
    return NextResponse.json({ error: '서버 오류 발생', details: err }, { status: 500 });
  }
}
